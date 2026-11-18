# PeSSiLi web app

Next.js (App Router) + **next-intl** (ar / fr / en, RTL for Arabic) + **Appwrite**, using the UMPT platform chrome (black header, gray hero, panel sections).

## Quick start

```bash
cd web
npm install
cp .env.example .env.local   # then set Appwrite project + API key
npm run appwrite:setup       # database, collections, 69 wilayas
npm run dev
```

Open [http://localhost:3000/fr](http://localhost:3000/fr) (default locale is French).

## Project docs

See [`../PESSILI_PLATFORM.md`](../PESSILI_PLATFORM.md) for product vision, journeys, and full data model.

## Appwrite

- Project ID: set in `NEXT_PUBLIC_APPWRITE_PROJECT_ID`
- Database: `pessili_main` (configurable)
- Server key: `APPWRITE_API_KEY` (never expose with `NEXT_PUBLIC_`)

Collections created by `scripts/setup-appwrite.mjs`: `wilayas`, `profiles`, `doctors`, `appointments`, `questionnaires`, `questionnaire_responses`, `consultation_reports`, `payments`, `notifications`, `audit_logs`.

## Security

Rotate any API key that was shared in chat. Keep `.env.local` out of git (already ignored).