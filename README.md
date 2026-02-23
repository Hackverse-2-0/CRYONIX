# 🏆 HackVerse - Team Repository

Welcome to your official team repository! This is your workspace for the duration of the hackathon. Please read the rules and evaluation guidelines carefully before you begin coding.

## Hackathon Rules & Evaluation Process

To ensure fairness and track your progress, this hackathon features a strict two-phase evaluation process. **You must push your code to this repository to be evaluated.** Code residing only on your local machines will not be graded.

### Evaluation 1: The Midpoint Check
* **Deadline:** 12:15 PM
* **Requirement:** You must have your initial project structure and foundational code pushed to the `main` branch. 
* **Purpose:** This check ensures your team is on track, actively collaborating, and has a viable concept in motion. Mentors/Judges will review your commit history and current progress.

### Evaluation 2: The Final Submission
* **Deadline:** 5:00 PM
* **Requirement:** Your completed project must be fully pushed to the `main` branch. 
* **Purpose:** This is the final version of your project that will be judged for the hackathon prizes.

### STRICT CODE FREEZE POLICY
**No modifications will be accepted after the Development Time ends at 5:00 PM.** Exactly at the deadline, all team repositories will be **Archived** and converted to **Read-Only**. 
* Any unpushed local commits will be lost and cannot be submitted.
* Late submissions, pull requests, or requests to add "just one last fix" will not be accepted under any circumstances.
* **Tip:** Push your code frequently! Do not wait until the last 5 minutes to push your entire project.

---

## Project Details (Team to fill this out)

*Please overwrite the information below with your actual project details before the final evaluation.*

### Team Name: 
CRYONIX

### Project Name:
SprintOS
### Project Description:
SprintOS is a web-based team execution platform designed for hackathons and fast-paced group projects. Unlike traditional tools that focus only on chatting or note-taking, SprintOS brings tasks, meeting notes, AI-powered summaries, and progress tracking into one unified dashboard. The platform helps teams instantly understand what needs to be done next by converting discussions into clear action items, visualizing progress, and organizing responsibilities in real time. Built with a modern web stack and AI integration, SprintOS reduces chaos during sprints and transforms scattered teamwork into structured execution.

### Setup & Installation Instructions:
# Deployment Guide - Mini Team OS

## Prerequisites
- Supabase project configured
- Environment variables ready
- Code built and tested locally

## Option 1: Deploy to Vercel (Recommended)

### Step 1: Prepare Repository
1. Initialize git (if not already):
   git init
   git add .
   git commit -m 'Initial commit: Mini Team OS'

2. Push to GitHub:
   - Create a new repository on GitHub
   - git remote add origin <your-repo-url>
   - git push -u origin master

### Step 2: Deploy on Vercel
1. Go to https://vercel.com
2. Click 'Import Project'
3. Select your GitHub repository
4. Configure:
   - Framework Preset: Vite
   - Build Command: npm run build
   - Output Directory: dist
   - Install Command: npm install

5. Add Environment Variables:
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   VITE_CHATANYWHERE_API_KEY
   VITE_CHATANYWHERE_BASE_URL

6. Click 'Deploy'

### Step 3: Verify
- Visit your deployment URL
- Test sign up/login
- Create a team
- Verify all features work

## Option 2: Deploy to Netlify

### Step 1: Build Settings
1. Go to https://netlify.com
2. Click 'Add new site' → 'Import an existing project'
3. Connect to GitHub
4. Configure:
   - Build command: npm run build
   - Publish directory: dist

### Step 2: Environment Variables
Go to Site settings → Environment variables
Add all required variables

### Step 3: Deploy
Click 'Deploy site'

## Option 3: Self-Hosted (VPS/Docker)

### Using Node.js
1. Install Node.js on server
2. Clone repository
3. npm install
4. npm run build
5. Use serve or nginx to serve dist/ folder

### Using Docker
Create Dockerfile:
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD npx serve -s dist -l 3000

Build and run:
docker build -t mini-team-os .
docker run -p 3000:3000 mini-team-os

## Post-Deployment Checklist

□ Environment variables configured
□ Supabase connection working
□ Authentication flow working
□ Team creation working
□ Tasks CRUD working
□ Notes working
□ AI summaries generating
□ Analytics displaying correctly
□ Real-time updates working
□ Mobile responsive

## Troubleshooting

**Issue: Environment variables not working**
- Ensure they start with VITE_
- Rebuild after changing variables
- Check deployment platform docs

**Issue: Supabase connection failed**
- Verify URL and anon key
- Check Supabase project is active
- Ensure RLS policies are enabled

**Issue: Build fails**
- Clear node_modules and reinstall
- Check Node.js version (16+)
- Verify all dependencies installed

## Custom Domain Setup

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as shown

### Netlify
1. Go to Domain settings
2. Add custom domain
3. Update DNS records

## Performance Optimization

1. Enable caching on CDN
2. Use production build
3. Enable compression
4. Monitor with Vercel/Netlify analytics

## Security Considerations

- Never commit .env file
- Use environment variables for all secrets
- Keep Supabase RLS policies enabled
- Regular dependency updates
- Monitor for security vulnerabilities

## Monitoring

- Vercel/Netlify built-in analytics
- Supabase database monitoring
- Error tracking (optional: Sentry)

## Support

For issues, check:
1. Deployment platform logs
2. Browser console errors
3. Supabase logs
4. Network tab for API errors

---

**Deployment Time: ~5-10 minutes**
**Recommended Platform: Vercel (best Vite support)**


