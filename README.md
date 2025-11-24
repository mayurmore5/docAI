
# AI Document Platform

A full-stack application for AI-assisted document (Word) and presentation (PowerPoint) generation.

## Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- Firebase Project (Auth & Firestore enabled)
- Google Gemini API Key

## Setup

### 1. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```
GEMINI_API_KEY=your_gemini_key
FIREBASE_CREDENTIALS_PATH=serviceAccountKey.json
```

Place your Firebase Admin SDK JSON file as `backend/serviceAccountKey.json`.

Run the server:
```bash
uvicorn main:app --reload
```

### 2. Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Run the dev server:
```bash
npm run dev
```

## Features

- **Authentication**: Google Login via Firebase.
- **Dashboard**: Manage your projects.
- **Project Wizard**: Create Word or PowerPoint projects with AI-generated outlines.
- **Editor**:
    - Generate content for each section/slide using Gemini.
    - Refine content with natural language instructions.
    - Export to `.docx` or `.pptx`.
