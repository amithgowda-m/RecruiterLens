# RecruiterLens — GitHub Profile Auditor

> Know exactly what a recruiter sees when they open your GitHub.

RecruiterLens is a web application that takes any GitHub username and generates a recruiter-perspective audit of their profile. It provides a structured score, triage labels for repositories, and an AI-generated analysis of strengths, red flags, and actionable steps.

## Features
- **Instant Audit**: Enter a GitHub username and get a comprehensive audit in seconds.
- **Scoring Engine**: Calculates a score out of 100 based on Profile Completeness, Project Quality, Activity, and Tech Diversity.
- **Repository Triage**: Automatically categorizes repositories into "SHOWCASE", "POLISH", or "ARCHIVE".
- **AI-Powered Insights**: Uses LLaMA 3.3 (via Groq) to provide personalized recruiter-level feedback, including strengths, red flags, and an action roadmap.

## Tech Stack
| Tier | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Backend** | Node.js, Express |
| **Data Source** | GitHub REST API v3 |
| **AI Layer** | Groq API (llama-3.3-70b-versatile) |

## Local Setup

Follow these exact steps to run the application locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/amithgowda-m/RecruiterLens.git
   cd RecruiterLens
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Variables Configuration**
   In the `/server` directory, create a `.env` file using the `.env.example`:
   ```bash
   cd ../server
   cp ../.env.example .env
   ```
   *Note: Edit `.env` to include your actual Groq API key.*

5. **Start the Backend Server**
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:3001`

6. **Start the Frontend Server**
   In a new terminal window:
   ```bash
   cd client
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## Environment Variables

| Variable | Description | Location | Default |
|---|---|---|---|
| `GROQ_API_KEY` | Your Groq API key for AI analysis | `/server/.env` | `your_groq_key_here` |
| `PORT` | Port for the backend server | `/server/.env` | `3001` |
| `VITE_API_BASE_URL` | The base URL for the backend API | `/client/.env` (optional) | `http://localhost:3001` |


