---
name: pessili-dashboards
description: Completes and fixes PeSSiLi Patient, Psychologist, and Admin dashboards from the three-dashboard MD specs. Use when implementing dashboard pages, empty nav items, clinician/admin modules, urgent care flows, or closing gaps against Pessili_Three_Dashboards_Spec.md / Pessili_Dashboards_Roles_and_Interfaces.md.
---

# PeSSiLi Dashboards Completer

## Specs (source of truth)

Read before changing dashboard UI or nav:

1. `D:\PESSILIdz\MDFILES\Pessili_Three_Dashboards_Spec.md` — **primary** (exactly three dashboards)
2. `D:\PESSILIdz\MDFILES\Pessili_Dashboards_Roles_and_Interfaces.md` — roles detail; map extra roles into the three dashboards (guardian → patient; psychiatrist → clinician; staff → admin sub-roles)

## Hard rules

1. **Preserve existing working pages** (patient cases, messages, records, booking, profile, marks/uploads). Extend; do not rewrite unless broken.
2. **Three account types only:** `patient` | `doctor` (clinician) | `admin`. Redirect `/dashboard` by role.
3. **Match existing visual language:** `PatientShell` / gray panel heads / brand `#007e94` / Fira Sans. Reuse `Panel`, `SectionTitle`, `DashboardPanelTile`, `DashboardCard`.
4. **i18n:** every user-facing string in `messages/{en,fr,ar}.json` or `messages/{clinician,admin,patient-extra}/{en,fr,ar}.json` merged in `src/i18n/request.ts`.
5. **Demo-first:** use `getDemoSession()` + local demo data modules when Appwrite tables are missing. Never invent production secrets.
6. **Empty pages are bugs:** every nav item must show real options, lists, CTAs, or interactive demo states—not "Coming soon" alone.

## Route map

### Patient (`/patient/...`) — nav in `src/lib/patient/nav.ts`

| Spec | Route | Status intent |
|------|-------|-----------------|
| Home | `/patient/dashboard` | Keep + add Talk now / sessions / payments tiles |
| Talk now | `/patient/talk-now` | Triage → waiting → fallback |
| Screening | `/patient/screening` | PHQ-9 / GAD-7 runnable |
| Find clinician / booking | `/patient/booking` | Keep directory |
| Sessions | `/patient/sessions` | Upcoming / past / join checklist |
| Records | `/patient/records` | Keep |
| Messages | `/patient/messages` | Keep + crisis banner |
| Payments | `/patient/payments` | Plans, wallet, invoices meter |
| Settings | `/patient/settings` | Privacy, emergency contact, devices |
| Guardian | `/patient/guardian` | Dependents mini-dashboard |
| Cases | `/patient/cases` | Keep (platform-specific) |
| Profile | `/patient/profile` | Keep |

### Clinician (`/clinician/...`) — `src/lib/clinician/nav.ts`

`Today · Urgent · Schedule · Requests · Patients · Session · Notes · Follow-up · Referrals · Earnings · Profile · Support` (+ Prescriptions when type=psychiatrist)

Redirect `doctor` role from `/dashboard` → `/clinician/today`.

### Admin (`/admin/...`) — `src/lib/admin/nav.ts`

`Overview · Urgent & Crisis · Clinicians · Patients · Sessions · Support · Content · Finance · Partnerships · Compliance · System`

Redirect `admin` role from `/dashboard` → `/admin/overview`. Hide modules by sub-role later; ship all modules for Super Admin demo.

## Implementation workflow

```
Progress:
- [ ] Diff routes vs tables in Three-Dashboards Spec §§5–7
- [ ] Preserve existing files; add missing routes only
- [ ] Shell + SubNav + role guard (session.role)
- [ ] Page content with actionable UI + demo data
- [ ] en/fr/ar strings
- [ ] Wire home cards / redirects
- [ ] Smoke: login as patient@ / doctor@ / admin@ demo users
```

## Patterns to copy

- Shell: `src/components/patient/PatientShell.tsx`
- Page chrome: `src/components/patient/PatientPage.tsx`
- Nav config: `src/lib/patient/nav.ts`
- Auth gate: `getDemoSession()` then `redirect` if wrong role
- Cards: `DashboardPanelTile` / `DashboardCard` / `Panel`

## Do not

- Create fourth dashboard for families, psychiatrists, or institution staff
- Remove Cloudinary/Appwrite patient document flows
- Leave nav links to 404 or blank shells
- Put clinical notes content in Admin Support/Patients metadata views

## When finishing a gap

Report: routes added, existing files untouched, remaining `[CONFIRM]` items left as UI copy only.
