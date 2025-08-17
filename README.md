# CyberGuard - Cybercrime Reporting System

A comprehensive cybercrime reporting and management system built with React and Supabase.

## Features

- **User Authentication**: Secure Aadhaar-based registration and login
- **Complaint Management**: File and track cybercrime complaints
- **Admin Dashboard**: Comprehensive admin interface for managing cases
- **AI-Powered Analysis**: Intelligent threat detection and case analysis
- **Real-time Alerts**: Security alerts and threat notifications
- **Educational Chatbot**: Learn about cybersecurity and prevention

## Setup Instructions

### 1. Clone and Install
```bash
npm install
```

### 2. Configure Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Get your project details from the Supabase dashboard:
   - Project ID (from the URL: `https://[PROJECT_ID].supabase.co`)
   - Public Anonymous Key (from Settings > API)

3. Update the configuration in `utils/supabase/info.jsx`:
```javascript
export const projectId = "your-project-id-here";
export const publicAnonKey = "your-public-anon-key-here";
```

### 3. Set up Database

Run the following SQL in your Supabase SQL editor to create the required table:

```sql
CREATE TABLE kv_store_1276a223 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

### 4. Deploy Edge Function

The server code is located in `supabase/functions/server/`. Deploy it to your Supabase project:

1. Install Supabase CLI
2. Login to Supabase: `supabase login`
3. Link your project: `supabase link --project-ref [YOUR_PROJECT_ID]`
4. Deploy the function: `supabase functions deploy server`

### 5. Run the Application
```bash
npm run dev
```

## Configuration

### Updating Supabase Connection

To connect to your own Supabase project:

1. **Get your project details** from Supabase dashboard
2. **Update `utils/supabase/info.jsx`**:
   ```javascript
   export const projectId = "your-actual-project-id";
   export const publicAnonKey = "your-actual-anon-key";
   ```
3. **Test the connection** - the app will automatically validate the configuration

### Environment Variables (Optional)

You can also use environment variables:
```bash
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## User Types

- **Citizens**: Can file complaints, track status, and access safety features
- **Officials**: Admin access to manage complaints, view analytics, and coordinate responses

## Demo Credentials

For testing purposes:
- **OTP**: Use `123456` for any phone verification
- **Admin Access**: Use any government ID with 8+ characters

## Tech Stack

- **Frontend**: React, Tailwind CSS, Radix UI
- **Backend**: Supabase Edge Functions (Deno)
- **Database**: Supabase PostgreSQL
- **Charts**: Recharts
- **Icons**: Lucide React

## Support

For issues or questions, please check the configuration in `utils/supabase/info.jsx` and ensure your Supabase project is properly set up.