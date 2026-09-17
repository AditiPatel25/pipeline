# pipeline

Pipeline is a full-stack job application tracker built to help organize and manage the job search in one place. It allows users to track applications, manage follow-ups, store resumes, and use AI to extract application details and analyze resume-to-job matches.

## Features

- **Application Tracking**
  - Add, edit, and delete job applications
  - Track application status, work arrangement, employment type, and application source
  - Search and filter applications
  - Sort applications by date or company

- **Follow-Up Management**
  - Add follow-ups to applications
  - Track due dates and completion status
  - Highlight overdue follow-ups
  - View upcoming follow-ups from the dashboard

- **Resume Management**
  - Upload and manage a saved resume
  - Store resumes securely using Supabase Storage
  - Replace or delete the saved resume

- **AI-Powered Tools**
  - Extract company, position, location, work arrangement, and employment type from job descriptions
  - Compare a resume against a job description
  - Identify matching skills and missing qualifications
  - Generate suggestions for tailoring a resume to a specific position
  - Structured AI responses are validated using JSON schemas for reliable application integration

- **Authentication**
  - User registration and login
  - JWT-based authentication using HTTP-only cookies
  - Protected application routes

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Motion
- Sonner

### Backend
- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- JWT
- Multer

### Services
- Neon PostgreSQL
- Supabase Storage
- OpenAI API