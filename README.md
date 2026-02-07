# VidyaAI - Career Guidance Platform

A full-stack career guidance platform with React frontend, Node.js backend, and Supabase database.

## Features

- **User Authentication**: Secure signup/signin with Supabase Auth
- **Profile Management**: Personal career profiles with education and experience
- **Resume Builder**: ATS-optimized resume creation and management
- **Career Recommendations**: AI-powered career path suggestions
- **Skill Gap Analysis**: Identify and bridge skill gaps
- **Learning Roadmaps**: Structured learning paths with progress tracking

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for development and building
- TailwindCSS for styling
- Lucide React for icons
- Supabase client for authentication

### Backend
- Node.js with Express
- TypeScript
- Supabase client for database operations
- CORS for frontend-backend communication
- Helmet for security
- Morgan for logging

### Database
- Supabase (PostgreSQL)
- Row Level Security (RLS) for data protection
- Automated migrations

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account and project

### 1. Clone and Setup Frontend

```bash
cd project
npm install
```

### 2. Clone and Setup Backend

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

#### Frontend (.env)
Create a `.env` file in the `project` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3001/api
```

#### Backend (.env)
Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=3001
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FRONTEND_URL=http://localhost:5173
```

### 4. Setup Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the migration script from `project/supabase/migrations/001_initial_schema.sql`

This will create all necessary tables, indexes, and RLS policies.

### 5. Start Development Servers

#### Start Backend
```bash
cd backend
npm run dev
```
The backend will start on `http://localhost:3001`

#### Start Frontend
```bash
cd project
npm run dev
```
The frontend will start on `http://localhost:5173`

### 6. Test the Application

1. Open `http://localhost:5173` in your browser
2. Create a new account or sign in
3. Complete your profile
4. Explore the features:
   - Create and manage resumes
   - Get career recommendations
   - View skill gaps
   - Create learning roadmaps

## API Endpoints

### Authentication
- `POST /api/auth/verify` - Verify JWT token

### Profile
- `GET /api/profile/profile?userId={id}` - Get user profile
- `PUT /api/profile/profile` - Update user profile

### Resumes
- `GET /api/resume/?userId={id}` - Get user resumes
- `POST /api/resume/` - Create new resume
- `PUT /api/resume/{id}` - Update resume
- `DELETE /api/resume/{id}` - Delete resume

### Career
- `GET /api/career/recommendations?userId={id}` - Get career recommendations
- `POST /api/career/recommendations` - Generate new recommendations
- `GET /api/career/skill-gaps?userId={id}` - Get skill gaps

### Roadmaps
- `GET /api/roadmap/?userId={id}` - Get learning roadmaps
- `POST /api/roadmap/` - Create new roadmap
- `GET /api/roadmap/{id}/items` - Get roadmap items
- `POST /api/roadmap/{id}/items` - Add roadmap items
- `PUT /api/roadmap/items/{itemId}` - Update item completion

## Development

### Building for Production

#### Frontend
```bash
cd project
npm run build
```

#### Backend
```bash
cd backend
npm run build
npm start
```

### Linting
```bash
# Frontend
cd project
npm run lint

# Backend
cd backend
npm run lint
```

### Type Checking
```bash
# Frontend
cd project
npm run typecheck

# Backend
cd backend
npm run typecheck
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend CORS configuration includes your frontend URL
2. **Database Connection**: Verify Supabase credentials in both frontend and backend
3. **Authentication Issues**: Check that Supabase Auth is properly configured
4. **Build Errors**: Run `npm install` to ensure all dependencies are installed

### Health Check

You can check if the backend is running by visiting:
`http://localhost:3001/api/health`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
