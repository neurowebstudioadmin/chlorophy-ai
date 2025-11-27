\# 🌿 Chlorophy AI



AI-Powered Website \& Web App Builder



\## 🎯 Project Overview



Chlorophy AI is a complete AI-powered platform for building websites and web applications through natural conversation with Claude AI.



\*\*Status:\*\* Week 1 - Day 1 Complete ✅



\## 🏗️ Tech Stack



\### Frontend

\- React 18 with Vite

\- Tailwind CSS

\- React Router DOM

\- Supabase JS Client



\### Backend

\- Node.js + Express

\- Supabase (Database + Auth)

\- Anthropic Claude API

\- CORS, Helmet, Dotenv



\### Infrastructure

\- Database: PostgreSQL (Supabase)

\- Authentication: Supabase Auth

\- Hosting: Local development (Vercel/Railway for production)



\## 📁 Project Structure

```

chlorophy-ai/

├── frontend/                 # React Frontend

│   ├── src/

│   │   ├── components/

│   │   │   ├── auth/        # Login, Signup

│   │   │   ├── dashboard/   # Dashboard

│   │   │   └── Logo.jsx     # Chlorophy Logo

│   │   ├── services/

│   │   │   └── supabase.js  # Supabase client

│   │   ├── App.jsx

│   │   └── main.jsx

│   ├── .env                  # Environment variables

│   └── package.json

│

└── backend/                  # Node.js Backend

&nbsp;   ├── src/

&nbsp;   │   └── server.js        # Express server

&nbsp;   ├── .env                 # Environment variables

&nbsp;   └── package.json

```



\## ✅ Completed Features



\### Authentication System

\- ✅ User registration with email verification

\- ✅ Login with Supabase Auth

\- ✅ Protected routes

\- ✅ Logout functionality



\### Dashboard

\- ✅ User dashboard with logo

\- ✅ Display logged-in user email

\- ✅ Projects section (UI ready)

\- ✅ Logout button



\### Branding

\- ✅ Professional Chlorophy logo (SVG)

\- ✅ Green color scheme (#10B981, #06B6D4, #84CC16)

\- ✅ Responsive design



\## 🚀 Getting Started



\### Prerequisites

\- Node.js 20+

\- npm 10+

\- Supabase account

\- Anthropic API key



\### Installation



1\. \*\*Clone the repository\*\*

```bash

git clone <your-repo-url>

cd chlorophy-ai

```



2\. \*\*Install frontend dependencies\*\*

```bash

cd frontend

npm install

```



3\. \*\*Install backend dependencies\*\*

```bash

cd ../backend

npm install

```



4\. \*\*Configure environment variables\*\*



Frontend `.env`:

```env

VITE\_SUPABASE\_URL=your\_supabase\_url

VITE\_SUPABASE\_ANON\_KEY=your\_supabase\_anon\_key

VITE\_API\_URL=http://localhost:3001

```



Backend `.env`:

```env

SUPABASE\_URL=your\_supabase\_url

SUPABASE\_SERVICE\_KEY=your\_supabase\_service\_key

ANTHROPIC\_API\_KEY=your\_anthropic\_api\_key

PORT=3001

NODE\_ENV=development

JWT\_SECRET=your\_jwt\_secret

FRONTEND\_URL=http://localhost:5173

```



5\. \*\*Start the servers\*\*



Terminal 1 (Backend):

```bash

cd backend

npm run dev

```



Terminal 2 (Frontend):

```bash

cd frontend

npm run dev

```



6\. \*\*Open browser\*\*

```

http://localhost:5173

```



\## 📊 Database Schema



\### Projects Table

\- id (UUID)

\- user\_id (UUID)

\- name (VARCHAR)

\- description (TEXT)

\- project\_type (VARCHAR)

\- html\_content (TEXT)

\- css\_content (TEXT)

\- js\_content (TEXT)

\- created\_at (TIMESTAMP)



\### Templates Table

\- id (UUID)

\- name (VARCHAR)

\- slug (VARCHAR)

\- category (VARCHAR)

\- price (DECIMAL)

\- html\_content (TEXT)

\- tags (JSONB)



\## 🎯 Next Steps (Week 1 - Day 2)



\- \[ ] Create AI Builder page

\- \[ ] Integrate Claude API for code generation

\- \[ ] Add chat interface

\- \[ ] Implement live preview

\- \[ ] Save generated projects to database



\## 📝 Development Notes



\*\*Current User:\*\* francescociniero@yahoo.de (Registered \& Verified)



\*\*Domains Registered:\*\*

\- chlorophy.com

\- chlorophy.de

\- chlorophy.store

\- chlorophy.info

\- chlorophy.cloud



\## 🤝 Contributing



This is a private project by Francesco.



\## 📄 License



Private - All Rights Reserved



---



\*\*Built with 💚 by Francesco\*\*  

\*\*Date:\*\* November 27, 2025

