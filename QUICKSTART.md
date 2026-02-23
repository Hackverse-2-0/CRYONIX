# Quick Start Guide

## Setup Instructions

1. Install dependencies:
   npm install

2. Configure Supabase:
   - Go to https://supabase.com and create a new project
   - Navigate to SQL Editor
   - Copy and paste the contents of supabase-schema.sql
   - Execute the SQL to create all tables and RLS policies

3. Get ChatAnywhere API Key (optional):
   - Visit https://api.chatanywhere.tech/v1/oauth/free/render
   - Get a free API key for AI summaries
   - Fallback mock summaries available if API key not provided

4. Create .env file (copy from .env.example):
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_CHATANYWHERE_API_KEY=your_api_key
   VITE_CHATANYWHERE_BASE_URL=https://api.chatanywhere.tech/v1

5. Start development server:
   npm run dev

6. Open http://localhost:5173

## First Steps

1. Sign up with email and password
2. Create your first team
3. Add tasks and notes
4. Generate AI summaries
5. View analytics

## Deployment

For production deployment:
- Build: npm run build
- Preview: npm run preview
- Deploy dist/ folder to Vercel or Netlify

Remember to set environment variables in your deployment platform!
