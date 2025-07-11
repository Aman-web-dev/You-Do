🧠 You-Do — AI-Powered Smart Todo App
You-Do is a full-stack, AI-powered todo application that intelligently generates tasks by syncing with your Google Calendar and Gmail. Built with Next.js for a modern, responsive frontend and Django with Django REST Framework for a robust backend, it leverages Google OAuth to access calendar events and emails, transforming them into actionable todos using AI.

🚀 Features

AI-Generated Todos: Automatically extracts tasks from Gmail emails and Google Calendar events using AI (via OpenRouter's cypher-alpha:free model).
Google OAuth Integration: Securely syncs with Google Calendar (read-only) and Gmail (read-only) to fetch relevant data.
Smart Task Management: Categorizes tasks with priorities (Low, Medium, High), categories (Work, Personal, Study, Other), and deadlines.
Monorepo Structure: Combines frontend (Next.js) and backend (Django) in a single repository for streamlined development.
Responsive UI: Built with Next.js and TailwindCSS for a clean, user-friendly interface.
RESTful API: Django REST Framework powers the backend with secure, scalable endpoints.


🛠️ Tech Stack

Frontend: Next.js (React framework), TailwindCSS
Backend: Django, Django REST Framework
Database: PostgreSQL (recommended for production), SQLite (for development/testing)
APIs: Google Calendar API (v3), Gmail API (v1), OpenRouter API
Authentication: Google OAuth 2.0
Other Tools: Python requests, base64, logging, and environment variable management with python-dotenv


📁 Project Structure
you-do/
│
├── frontend/                     # Next.js frontend
│   ├── pages/                    # Next.js pages
│   ├── components/               # Reusable React components
│   ├── styles/                   # TailwindCSS and global styles
│   ├── .env.example              # Frontend environment variables template
│   └── .env.local                # Frontend environment variables (not tracked)
│
├── server/                       # Django backend
│   ├── manage.py                 # Django management script
│   ├── app/                      # Django app
│   │   ├── migrations/           # Database migrations
│   │   ├── models.py             # Models (e.g., GoogleOAuth, Task)
│   │   ├── views.py              # API views for task sync and AI processing
│   │   └── urls.py               # API endpoints
│   ├── .env.example              # Backend environment variables template
│   └── .env                      # Backend environment variables (not tracked)
│
├── README.md                     # Project documentation
└── .env.example                  # Root-level environment variables (if needed)


📦 Prerequisites

Node.js (v16 or higher)
Python (v3.8 or higher)
PostgreSQL (optional, for production) or SQLite (included with Django)
Google Cloud Console project with Google Calendar API and Gmail API enabled
OpenRouter API key for AI task generation
A modern web browser (e.g., Chrome, Firefox)


⚙️ Setup Instructions
1. Clone the Repository
git clone https://github.com/your-username/you-do.git
cd you-do

2. Backend Setup (Django)
Navigate to the server directory:
cd server

Create and activate a virtual environment:
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

Install dependencies:
pip install -r requirements.txt

Copy the .env.example to .env:
cp .env.example .env

Edit server/.env with your environment variables:
# Django settings
SECRET_KEY=your_django_secret_key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3  # or postgresql://user:password@localhost:5432/dbname for PostgreSQL

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# OpenRouter API
OPENAI_API_KEY=your_openrouter_api_key

Run database migrations:
python manage.py migrate

Start the Django development server:
python manage.py runserver

The backend will be available at http://localhost:8000.
3. Frontend Setup (Next.js)
Navigate to the frontend directory:
cd frontend

Install dependencies:
npm install

Copy the .env.example to .env.local:
cp .env.example .env.local

Edit frontend/.env.local with your environment variables:
# Next.js API endpoint
NEXT_PUBLIC_API_URL=http://localhost:8000/api

Run the Next.js development server:
npm run dev

The frontend will be available at http://localhost:3000.
4. Google OAuth Configuration

Go to the Google Cloud Console.
Create a new project or select an existing one.
Enable the Google Calendar API and Gmail API.
Create OAuth 2.0 credentials:
Set the Authorized JavaScript origins to http://localhost:3000.
Set the Authorized redirect URIs to http://localhost:3000/api/auth/callback/google.


Copy the Client ID and Client Secret to server/.env.
Ensure the OAuth consent screen includes scopes:
https://www.googleapis.com/auth/calendar.readonly
https://www.googleapis.com/auth/gmail.readonly




🌟 Usage

Login with Google: Access the app at http://localhost:3000, sign in with Google OAuth to authorize calendar and email access.
Sync Data: The backend automatically syncs Gmail emails and Google Calendar events for the current day Hegins day, generating tasks.
View Todos: The frontend displays AI-generated todos with titles, descriptions, priorities, categories, and deadlines.
Manage Tasks: Accept, edit, or delete tasks via the UI.


🧠 AI Task Generation
The backend processes Gmail emails and Google Calendar events to generate tasks:

Emails: Fetches non-spam, non-promotional emails from the past 24 hours, extracts relevant content, and sends it to the AI for task extraction.
Calendar: Retrieves events for the next 24 hours from the primary calendar, formats them, and sends them to the AI.
AI Processing: Uses OpenRouter's cypher-alpha:free model to generate tasks in JSON format with fields: title, description, priority, categories, deadline, dueDate, and source.
Token Management: Automatically renews Google OAuth access tokens using refresh tokens and updates the database.

Tasks are returned as a JSON array, parsed, and displayed in the frontend. Example output:
[
  {
    "title": "Team Meeting",
    "description": "Discuss project updates",
    "priority": 3,
    "categories": ["WORK"],
    "deadline": "2025-07-09T10:00:00+00:00",
    "source": "calendar"
  },
  {
    "title": "Follow up with client",
    "description": "Respond to John's email",
    "priority": 2,
    "categories": ["WORK"],
    "deadline": "2025-07-09T17:00:00+00:00",
    "source": "email"
  }
]


🐳 Docker Setup (Optional)
To run the app with Docker:

Install Docker and Docker Compose.
Create a docker-compose.yml in the root directory (example provided in the repository).
Run:

docker-compose up

This sets up the frontend, backend, and PostgreSQL database in containers.

🛠️ API Endpoints

POST /api/auth/google: Handle Google OAuth callback and store tokens.
GET /api/tasks/sync: Sync Gmail and Calendar data, generate AI tasks.
POST /api/tasks/suggest: Generate a single AI task from provided title and description.
GET /api/tasks: List all tasks for the authenticated user.
POST /api/tasks: Create a new task.
PUT /api/tasks/:id: Update a task.
DELETE /api/tasks/:id: Delete a task.


🔧 Development Notes

Backend: Ensure GoogleOAuth model has fields: user_id, access_token, refresh_token, token_expiry. The Task model should include user_id, title, description, priority, categories, dueDate, source.
Frontend: Use Next.js API routes for OAuth callbacks and fetch tasks from the backend.
Logging: Backend uses Python's logging module for debugging (configured in settings.py).
Task Deduplication: The AI avoids creating duplicate tasks by referencing existing tasks in the prompt.


🙌 Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m "Add your feature").
Push to the branch (git push origin feature/your-feature).
Open a pull request.

Please update .env.example if you add new environment variables and follow the coding style (e.g., PEP 8 for Python, ESLint for JavaScript).

📧 Contact
Created by Aman Kumar. For questions, feedback, or issues, please:

Open an issue on the GitHub repository.
Email: your-email@example.com.


📜 License
This project is licensed under the MIT License. See the LICENSE file for details.