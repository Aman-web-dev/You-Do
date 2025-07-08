from openai import OpenAI
from datetime import datetime, timedelta
from .models import GoogleOAuth, Task
import requests
import base64
import os


api_key = os.getenv("OPENAI_API_KEY")


def get_calendar_events(access_token):
    # Define time range: from now to next 24 hours
    now = datetime.now().isoformat() + "Z"
    tomorrow = (datetime.now() + timedelta(days=1)).isoformat() + "Z"

    url = f"https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin={now}&timeMax={tomorrow}&singleEvents=true&orderBy=startTime"
    headers = {"Authorization": f"Bearer {access_token}"}

    res = requests.get(url, headers=headers)
    data = res.json()

    events = []

    for event in data.get("items", []):
        summary = event.get("summary", "No Title")
        start = event.get("start", {}).get(
            "dateTime", event.get("start", {}).get("date")
        )
        end = event.get("end", {}).get("dateTime", event.get("end", {}).get("date"))
        description = event.get("description", "")

        events.append(
            {"title": summary, "start": start, "end": end, "description": description}
        )

    return events


def get_gmail_messages(user_id, access_token):
    today = datetime.now().date()
    after_ts = int(datetime(today.year, today.month, today.day).timestamp())
    before_ts = after_ts + 86399

    query = f"https://gmail.googleapis.com/gmail/v1/users/me/messages?q=after:{after_ts} before:{before_ts} -in:spam -in:trash -category:promotions -category:social -category:updates -category:forums"
    headers = {"Authorization": f"Bearer {access_token}"}

    msg_ids_res = requests.get(query, headers=headers).json()
    print(msg_ids_res)
    message_ids = msg_ids_res.get("messages", [])

    cleaned_emails = []

    print("message ids ", message_ids)

    for msg_meta in message_ids[:10]:  # Limit to 10
        msg_id = msg_meta["id"]
        msg_res = requests.get(
            f"https://gmail.googleapis.com/gmail/v1/users/me/messages/{msg_id}?format=full",
            headers=headers,
        ).json()

        payload = msg_res.get("payload", {})
        headers_list = payload.get("headers", [])
        snippet = msg_res.get("snippet", "")

        subject = next(
            (h["value"] for h in headers_list if h["name"] == "Subject"), "No Subject"
        )
        sender = next((h["value"] for h in headers_list if h["name"] == "From"), "")
        date = next((h["value"] for h in headers_list if h["name"] == "Date"), "")

        plain_part = next(
            (p for p in payload.get("parts", []) if p.get("mimeType") == "text/plain"),
            None,
        )
        body_text = ""

        if plain_part and plain_part["body"].get("data"):
            decoded_data = base64.urlsafe_b64decode(
                plain_part["body"]["data"] + "=="
            ).decode("utf-8", errors="ignore")
            body_text = decoded_data.strip()
        else:
            body_text = snippet

        full_text = f"Subject: {subject}\nFrom: {sender}\nDate: {date}\n\n{body_text}"

        # 🔎 Basic spam check (you can enhance this)
        skip_keywords = [
            "job",
            "newsletter",
            "apply now",
            "opportunities",
            "subscription",
            "webinar",
        ]
        if any(k.lower() in full_text.lower() for k in skip_keywords):
            continue

        cleaned_emails.append(full_text)

    return cleaned_emails


def syncTasksBasedOnGmailAndCalendarData(userId):
    oauth_data = GoogleOAuth.objects.filter(user_id=userId).first()
    if not oauth_data:
        return "OAuth data not found"

    access_token = oauth_data.access_token

    print("access_token", access_token)

    email_texts = get_gmail_messages(user_id=userId, access_token=access_token)

    print("emails_texts", email_texts)
    email_input = "Emails:\n" + "\n\n".join(email_texts)

    calendar_texts = get_calendar_events(access_token=access_token)
    calendar_input = "Google Calendar Data:\n" + "\n\n".join(calendar_texts)

    print("calendar texts", calendar_texts)

    existing_tasks = Task.objects.filter(user_id=userId)
    task_info = "Existing Tasks:\n" + "\n".join(
        [f"- {t.title} due on {t.dueDate}" for t in existing_tasks]
    )

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )

    print(f"{email_input}\n\n{task_info}\n\n{calendar_input}")

    prompt = f"{email_input}\n\n{task_info}\n\n{calendar_input}"

    completion = client.chat.completions.create(
        model="openrouter/cypher-alpha:free",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an assistant that extracts todos from emails and calendar events and returns an array of objects in JSON "
                    "with fields: title, description, priority (ENUM: LOW=1, MEDIUM=2, HIGH=3), categories (ENUM: WORK, PERSONAL, OTHERS), deadline (ISO string), "
                    "dueDate (ISO string), and source (email/calendar). Only return relevant tasks, ignore spam, ads, job alerts, and newsletters. "
                    "Avoid creating duplicate or overlapping tasks based on existing user tasks provided."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        response_format="json",
    )

    print("AI Todo Suggestions:\n", completion.choices[0].message.content)
    return completion.choices[0].message.content


def createAiSuggestion(title, description):
    print(
        f"title:{title},description:{description},currentTime:{datetime.now().isoformat()}Z"
    )

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )

    completion = client.chat.completions.create(
        model="openrouter/cypher-alpha:free",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an AI task assistant. Based on the provided task title and description, "
                    "you must analyze its complexity and urgency to suggest:\n"
                    "- A priority score (1 = Low, 2 = Medium, 3 = High)\n"
                    "you must rewrite todo's description with the existing description you have "
                    "- An estimated number of hours it would realistically take to complete\n\n"
                    "Respond ONLY in this JSON format:\n"
                    '{ "priority_score": <1|2|3>, "hours_required": <int>,description:(string )-not more than 200 words  }'
                ),
            },
            {
                "role": "user",
                "content": f"title:{title},description:{description},currentTime:{datetime.now().isoformat()}Z",
            },
        ],
        response_format="json",
    )

    print(completion.choices[0].message.content)

    return completion.choices[0].message.content
