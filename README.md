# CyberGuard - Cybercrime Reporting System

A comprehensive cybercrime reporting and management system built with React and Supabase.

## Features

- **User Authentication**: Secure Aadhaar-based registration and login
- **Complaint Management**: File and track cybercrime complaints
- **Admin Dashboard**: Comprehensive admin interface for managing cases
- **AI-Powered Analysis**: Intelligent threat detection and case analysis
- **Real-time Alerts**: Security alerts and threat notifications
- **Educational Chatbot**: Learn about cybersecurity and prevention

## Quick Setup

### 1. Clone and Install
```bash
npm install
```

### 2. Environment Setup
1. Copy `.env.example` to `.env`
2. Update the environment variables with your Supabase project details

### 3. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com)
2. Run the SQL migrations in your Supabase SQL editor (found in `supabase/migrations/`)
3. Get your project URL and anon key from Settings > API
4. Update your `.env` file:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the Application
```bash
npm run dev
```

## Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
```

## Demo Credentials

For testing purposes:
- **OTP**: Use `123456` for any phone verification
- **Admin Access**: Register with government ID (8+ characters)

## Environment Variables

Required environment variables:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Database Schema

The application uses the following main tables:
- `users`: User authentication and profile data
- `complaints`: Cybercrime complaint reports
- `suspicious_entities`: Suspicious entity reports

## Tech Stack

- **Frontend**: React, Tailwind CSS, Radix UI
- **Backend**: Supabase (PostgreSQL + Auth)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel

## Support

1. Ensure your Supabase project is properly configured
2. Check that all environment variables are set correctly
3. Verify database migrations have been run
4. Test the connection using the app's built-in diagnostics

For issues, check the browser console for detailed error messages.