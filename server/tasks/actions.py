from openai import OpenAI
from datetime import datetime, timedelta
from .models import GoogleOAuth, Task
import requests
import base64
import os
import logging
from django.utils.dateparse import parse_datetime
import json
import re



# Set up logging
logger = logging.getLogger(__name__)

def renew_google_access_token(user_id):
   
    oauth_data = GoogleOAuth.objects.filter(user_id=user_id).first()
    if not oauth_data:
        logger.error(f"No OAuth data found for user_id: {user_id}")
        return {"error": "OAuth data not found"}

    if not oauth_data.refresh_token:
        logger.error(f"No refresh token available for user_id: {user_id}")
        return {"error": "Refresh token not available"}

    token_url = "https://oauth2.googleapis.com/token"
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")

    if not client_id or not client_secret:
        logger.error("Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET")
        return {"error": "Missing client credentials"}

    data = {
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": oauth_data.refresh_token,
        "grant_type": "refresh_token",
    }

    try:
        response = requests.post(token_url, data=data)
        response.raise_for_status()
    except requests.RequestException as e:
        logger.error(f"Failed to refresh token for user_id {user_id}: {str(e)}")
        return {"error": "Failed to refresh token", "detail": str(e)}

    token_data = response.json()
    access_token = token_data.get("access_token")
    expires_in = token_data.get("expires_in") 

    if not access_token:
        logger.error(f"No access token returned for user_id {user_id}")
        return {"error": "No access token returned"}

    oauth_data.access_token = access_token
    oauth_data.expires_in = expires_in  
    oauth_data.save()

    logger.info(f"Access token renewed for user_id {user_id}")
    return {"success": True, "access_token": access_token}


def get_calendar_events(access_token, user_id):

    def fetch_events(token):
        now = datetime.now().isoformat() + "Z"
        tomorrow = (datetime.now() + timedelta(days=1)).isoformat() + "Z"

        url = "https://www.googleapis.com/calendar/v3/calendars/primary/events"
        params = {
            "timeMin": now,
            "timeMax": tomorrow,
            "singleEvents": True,
            "orderBy": "startTime",
        }
        headers = {"Authorization": f"Bearer {token}"}

        return requests.get(url, headers=headers, params=params)

    try:
        response = fetch_events(access_token)
        if response.status_code == 401:
            logger.warning(f"Access token expired for user_id {user_id}, attempting renewal...")
            renewal = renew_google_access_token(user_id)

            if not renewal.get("success"):
                logger.error(f"Token renewal failed for user_id {user_id}: {renewal.get('error')}")
                return []

            new_token = renewal["access_token"]
            response = fetch_events(new_token)

        response.raise_for_status()
        data = response.json()

    except requests.RequestException as e:
        logger.error(f"Failed to fetch calendar events: {str(e)}")
        return []

    if "error" in data:
        logger.error(f"Calendar API error: {data['error']}")
        return []

    events = []
    for event in data.get("items", []):
        summary = event.get("summary", "No Title")
        start = event.get("start", {}).get("dateTime", event.get("start", {}).get("date"))
        end = event.get("end", {}).get("dateTime", event.get("end", {}).get("date"))
        description = event.get("description", "")

        events.append({
            "title": summary,
            "start": start,
            "end": end,
            "description": description,
        })

    logger.info(f"Fetched {len(events)} calendar events for user_id {user_id}")
    return events


def get_gmail_messages(user_id, access_token):

    def fetch_message_ids(token):
        today = datetime.now().date()
        after_ts = int(datetime(today.year, today.month, today.day).timestamp())
        before_ts = after_ts + 86399

        query = f"https://gmail.googleapis.com/gmail/v1/users/me/messages?q=after:{after_ts} before:{before_ts} -in:spam -in:trash -category:promotions -category:social -category:updates -category:forums"
        headers = {"Authorization": f"Bearer {token}"}
        return requests.get(query, headers=headers)

    try:
        msg_ids_res = fetch_message_ids(access_token)

        if msg_ids_res.status_code == 401:
            logger.warning(f"Access token expired for user_id {user_id}, attempting renewal...")
            renewed = renew_google_access_token(user_id)
            if not renewed.get("success"):
                logger.error(f"Token renewal failed for user_id {user_id}: {renewed.get('error')}")
                return []

            access_token = renewed["access_token"]
            msg_ids_res = fetch_message_ids(access_token)

        msg_ids_res.raise_for_status()
        msg_ids_data = msg_ids_res.json()
    except requests.RequestException as e:
        logger.error(f"Failed to fetch Gmail message IDs for user_id {user_id}: {str(e)}")
        return []

    message_ids = msg_ids_data.get("messages", [])
    cleaned_emails = []

    for msg_meta in message_ids[:10]:  # Limit to 10
        msg_id = msg_meta["id"]
        try:
            msg_res = requests.get(
                f"https://gmail.googleapis.com/gmail/v1/users/me/messages/{msg_id}?format=full",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            msg_res.raise_for_status()
            msg_data = msg_res.json()
        except requests.RequestException as e:
            logger.error(f"Failed to fetch message {msg_id} for user_id {user_id}: {str(e)}")
            continue

        payload = msg_data.get("payload", {})
        headers_list = payload.get("headers", [])
        snippet = msg_data.get("snippet", "")

        subject = next((h["value"] for h in headers_list if h["name"] == "Subject"), "No Subject")
        sender = next((h["value"] for h in headers_list if h["name"] == "From"), "")
        date = next((h["value"] for h in headers_list if h["name"] == "Date"), "")

        plain_part = next(
            (p for p in payload.get("parts", []) if p.get("mimeType") == "text/plain"), None
        )
        body_text = ""

        if plain_part and plain_part["body"].get("data"):
            try:
                decoded_data = base64.urlsafe_b64decode(
                    plain_part["body"]["data"] + "=="
                ).decode("utf-8", errors="ignore")
                body_text = decoded_data.strip()
            except Exception as e:
                logger.warning(f"Failed to decode message {msg_id}: {e}")
                body_text = snippet
        else:
            body_text = snippet

        full_text = f"Subject: {subject}\nFrom: {sender}\nDate: {date}\n\n{body_text}"

        skip_keywords = [
            "job", "newsletter", "apply now", "opportunities", "subscription", "webinar"
        ]
        if any(k.lower() in full_text.lower() for k in skip_keywords):
            continue

        cleaned_emails.append(full_text)

    logger.info(f"Fetched {len(cleaned_emails)} Gmail messages for user_id {user_id}")
    return cleaned_emails




def syncTasksBasedOnGmailAndCalendarData(userId):

    oauth_data = GoogleOAuth.objects.filter(user_id=userId).first()
    if not oauth_data:
        return "OAuth data not found"

    access_token = oauth_data.access_token
    if not access_token:
        logger.error(f"Failed to obtain valid access token for user_id {userId}")
        return {"error": "Unable to obtain valid access token"}

    email_texts = get_gmail_messages(user_id=userId, access_token=access_token)
    email_input = "Emails:\n" + "\n\n".join(email_texts) if email_texts else "No emails found"

    calendar_texts = get_calendar_events(access_token=access_token,user_id=userId)
    calendar_input = "Google Calendar Data:\n" + "\n\n".join(
        [f"Title: {e['title']}, Start: {e['start']}, End: {e['end']}, Description: {e['description']}" 
         for e in calendar_texts]
    ) if calendar_texts else "No calendar events found"

    existing_tasks = Task.objects.filter(user_id=userId)
    task_info = "Existing Tasks:\n" + "\n".join(
        [f"- {t.title} due on {t.deadline}" for t in existing_tasks]
    ) if existing_tasks else "No existing tasks"

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.error("Missing OPENAI_API_KEY")
        return {"error": "Missing API key"}

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )

    prompt = f"{email_input}\n\n{task_info}\n\n{calendar_input}"
    logger.debug(f"AI Prompt for user_id {userId}:\n{prompt}")

    try:
        completion = client.chat.completions.create(
            model="openrouter/cypher-alpha:free",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an assistant that extracts todos from emails and calendar events and returns an array of objects in JSON "
                        "with fields: title, description (description should be at most 300 words and at least 30 words it should explain what the task is or just repeat the title itself)}, priority (ENUM: LOW=1, MEDIUM=2, HIGH=3), categories (ENUM: WORK, PERSONAL, OTHERS), "
                        "deadline (ISO string) and source (email/calendar). Only return relevant tasks, ignore spam, ads, "
                        "job alerts, and newsletters. Avoid creating duplicate or overlapping tasks based on existing user tasks provided."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            response_format={"type": "json_object"},
        )

        result = completion.choices[0].message.content
        

        if result.startswith("```"):
            result = re.sub(r"^```json|^```|```$", "", result.strip(), flags=re.IGNORECASE).strip()

        
        print("Result",result)

        try:
            tasks_data = json.loads(result)  
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI result: {e}")
            return {"error": "Invalid JSON from AI", "detail": str(e)}

        # Then call your function
        create_tasks_from_response(userId, tasks_data)

        return result
    except Exception as e:
        logger.error(f"AI task generation failed for user_id {userId}: {str(e)}")
        return {"error": "Failed to generate tasks", "detail": str(e)}

def create_tasks_from_response(user_id, tasks_data):
    created_tasks = []

    for task_data in tasks_data:
        try:
            task = Task.objects.create(
                user_id=user_id,
                title=task_data.get("title", ""),
                description=task_data.get("description", ""),
                category=task_data.get("categories", ["WORK"])[0],  # Take first category
                priority_score=task_data.get("priority", 2),
                deadline=parse_datetime(task_data.get("deadline")),
            )
            created_tasks.append(task)
        except Exception as e:
        
            print(f"Failed to create task: {task_data.get('title')} - {e}")

    return created_tasks


def createAiSuggestion(title, description):
  
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.error("Missing OPENAI_API_KEY")
        return {"error": "Missing API key"}

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )

    try:
        completion = client.chat.completions.create(
            model="openrouter/cypher-alpha:free",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an AI task assistant. Based on the provided task title and description, "
                        "analyze its complexity and urgency, then generate a task object with the following fields:\n\n"
                        "- title: (as given)\n"
                        "- description: Rewrite the task description in a clear, concise manner (max 200 words)\n"
                        "- category: Choose one from ['WORK', 'PERSONAL', 'STUDY', 'OTHER'] based on content\n"
                        "- priority_score: 1 = Low, 2 = Medium, 3 = High\n"
                        "- deadline: Set a realistic deadline in ISO format (e.g., '2025-07-10T17:00:00Z') assuming today's date is current and is provided too\n"
                        "- status: Excluded\n"
                        "- created_at / updated_at: Excluded\n\n"
                        "Respond ONLY in this JSON format:\n"
                        "{\n"
                        '  "title": <string>,\n'
                        '  "description": <string>,\n'
                        "  \"category\": <'WORK'|'PERSONAL'|'STUDY'|'OTHER'>,\n"
                        '  "priority_score": <1|2|3>,\n'
                        '  "deadline": <ISO 8601 datetime string>\n'
                        "}"
                    ),
                },
                {
                    "role": "user",
                    "content": f"title:{title},description:{description},currentTime:{datetime.now().isoformat()}Z",
                },
            ],
            response_format={"type": "json_object"},
        )
        result = completion.choices[0].message.content
        logger.info(f"AI suggestion generated: {result}")
        return result
    except Exception as e:
        logger.error(f"AI suggestion generation failed: {str(e)}")
        return {"error": "Failed to generate suggestion", "detail": str(e)}