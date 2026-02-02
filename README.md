# Victor Kolade Abobarin - Portfolio

A single-screen portfolio showcasing work, projects, and contact information with AI-powered contact form.

## Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your OPENAI_API_KEY and RESEND_API_KEY to .env

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view.

### Environment Variables

- `OPENAI_API_KEY` - Get from [OpenAI Platform](https://platform.openai.com/api-keys)
- `RESEND_API_KEY` - Get from [Resend](https://resend.com/api-keys)
- `CONTACT_EMAIL` - Email address to receive contact form submissions
- `FROM_EMAIL` - Domain for sending emails (default: `onboarding@resend.dev`)

### Resend Setup (Important)

**For Testing:**
- Use `onboarding@resend.dev` as `FROM_EMAIL`
- Set `CONTACT_EMAIL` to the email associated with your Resend account
- Resend only allows sending to your own email in testing mode

**For Production:**
1. Verify a domain at [resend.com/domains](https://resend.com/domains)
2. Update `FROM_EMAIL` to use your verified domain (e.g., `contact@yourdomain.com`)
3. Update `CONTACT_EMAIL` to your preferred email
4. Now you can receive emails from anyone

## Structure

- `data.ts` - All portfolio content (easy to update)
- `app/page.tsx` - Main page component
- `app/globals.css` - Styling and animations
- `components/ContactForm.tsx` - Contact form with AI polish
- `app/api/polish/route.ts` - OpenAI message polishing endpoint
- `app/api/contact/route.ts` - Resend email sending endpoint

## Features

### Contact Form with AI Polish
- Write a message and click the ✨ icon to polish it with AI
- AI generates a concise, professional version + subject line
- Click the ↻ icon to revert to your original text
- Emails sent via Resend API
- Automatic confirmation email to sender

## Design

- Dark theme with amber accents
- Split layout: hero left, horizontal scroll cards right
- Snap-to-card scrolling for Work, Projects, Now, and Contact sections
- IBM Plex Mono + Libre Baskerville fonts
- Keyboard navigation (arrow keys to switch cards)

## Build

```bash
npm run build
npm start
```
