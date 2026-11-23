# PeSSiLi dashboards — quick gap checklist

## Patient must have

- [x] Talk now (triage + waiting + unmatched fallbacks)
- [x] Sessions list + pre-join checklist
- [x] Payments (500 DZD / 1000 DZD sub + meter)
- [x] Settings & privacy (emergency contact, discreet, devices)
- [x] Guardian mode
- [x] Screening runnable (not stub-only)
- [x] Crisis always reachable

## Clinician must have

- [x] Available now toggle on Today
- [x] Urgent offers with countdown accept/decline
- [x] Schedule / availability editor
- [x] Requests inbox
- [x] Patients list (relationship-scoped)
- [x] Session room shell + crisis tools
- [x] Notes & reports templates
- [x] Follow-up / referrals / earnings / profile / support
- [x] Prescriptions module gated for psychiatrist

## Admin must have

- [x] Overview KPIs + alerts
- [x] Live urgent queue + crisis board
- [x] Clinician verification queue
- [x] Patients metadata only
- [x] Sessions ops + Support tickets
- [x] Content & screening library
- [x] Finance + Partnerships
- [x] Compliance audit + System config

## Demo accounts

- `patient@demo.pessili.dz` / `DemoPatient2026!`
- `doctor@demo.pessili.dz` / `DemoDoctor2026!`
- `admin@demo.pessili.dz` / `DemoAdmin2026!`

## Route smoke map

| Role | Entry | Must open |
|------|-------|-----------|
| patient | `/patient/dashboard` | talk-now, sessions, payments, settings, guardian, screening |
| doctor | `/clinician/today` | all CLINICIAN_NAV (+ prescriptions if psychiatrist) |
| admin | `/admin/overview` | all ADMIN_NAV |

## Still deferred (product `[CONFIRM]`, not empty UI)

- Real WebRTC / payment gateway / SMS bridge
- Admin sub-role module hiding (ship Super Admin demo)
- Family plan legal age / controlled substances rules
