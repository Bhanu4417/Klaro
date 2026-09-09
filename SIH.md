# Klaro — AI-Powered Packaged Food Scanner & Legal Metrology Enforcement Platform

## 1. Technologies to be Used

### Programming Languages
- TypeScript / JavaScript (ES2023) — entire codebase
- SQL (Supabase schema migrations)
- HTML5 / CSS3 (Tailwind utility layer)

### Frontend Framework & UI
- **Next.js 16** (App Router, Server Actions, API Routes) + **React 19**
- **Tailwind CSS 3.4** with custom tactile "receipt/paper" design system (Satoshi font)
- **framer-motion** — physics-based animations (scanner reticle, receipt printing, state transitions)
- **lucide-react** icon system, **canvas-confetti**, **@svg-maps/india** (India map visualizations)
- Custom component library: `TactileCard`, `Button`, `Input`, `Badge`, `KlaroBot` (animated mascot)

### Backend & Services
- **Clerk** (`@clerk/nextjs`) — authentication: email/password, OAuth (Google/GitHub/Apple), officer logins, route protection via middleware
- **Supabase** (PostgreSQL + service-role server actions) — reports, votes, comments, audit dossiers, profiles
- **Cloudinary** — evidence image upload & hosting
- **Klaro Audit Engine** (rule-based compliance engine, `src/lib/auditEngine.ts`) — generates NON_COMPLIANT/COMPLIANT/WARNING dossiers with OCR-style measured-vs-required values, evidence hashes, confidence scores, citing **LMPC Rules 2011** (Rule 6(1)(a/e/f), Rule 6(10), Rule 7 font-size tables)
- **Local AI assistant** (`/api/admin-assistant`) — NLP-guided officer help for MRP/penalty/OCR queries

### Tooling
- **Bun** (runtime + package manager), ESLint, PostCSS/Autoprefixer, Vercel (deployment target)

### Hardware
- Smartphone camera / webcam (label capture for scanning) — no special hardware; runs in any modern browser (PWA-ready, mobile-first 375–430px)
- Standard cloud hosting (Vercel + Supabase/Cloudinary free tiers)

## 2. Methodology & Process for Implementation

### Process Flow Chart

```
┌─────────────────┐
│  Landing Page   │  (Hero, ScanDemo, HowItWorks, EvidenceEngine,
│  (Public)       │   ProblemComparison, EnforcementDashboard)
└────────┬────────┘
         ▼
┌─────────────────┐     Email/Password, Google/GitHub/Apple OAuth
│  Authentication │ ──► Password strength meter, OTP email verify,
│  (Clerk)        │     Forgot/Reset password, Profile onboarding
└────────┬────────┘     (@handle + avatar)
         ▼
┌─────────────────────────────────────┐
│           DASHBOARD (Community)     │
│  • Feed of citizen violation posts  │
│  • Upvote/downvote, comments, share │
│  • Filters: commodity/severity/zone │
│  • India pixel-map scatter view     │
└────────┬────────────────────────────┘
         ▼
┌─────────────────────────────────────┐
│         SCAN FLOW (Core AI)         │
│ 1. Capture/upload package label     │
│    → Cloudinary upload              │
│ 2. Audit Engine analyses label      │
│    (OCR declarations: MRP, net qty, │
│    manufacturer, consumer care,     │
│    country of origin, font heights) │
│ 3. Generate Audit Report dossier    │
│    with legal citations (LMPC 2011),│
│    evidence hash, confidence score  │
│ 4. Receipt-printer animation output │
└────────┬────────────────────────────┘
         ▼
┌──────────────────────┐    ┌───────────────────────────────┐
│  CITIZEN PATH        │    │  ENFORCEMENT PATH (Officer)   │
│  Post to community   │──► │  Admin dashboard + post map   │
│  w/ evidence image + │    │  Review dossier → draft notice│
│  audit report        │    │  → compounding order w/ sign- │
└──────────────────────┘    │  ature hash, penalty, section │
                            │  code + export dossier        │
                            └───────────────────────────────┘
```

### Implementation Methodology
1. **Agile/incremental sprints**: auth shell → community feed → scan engine → admin enforcement.
2. **Design-first**: established the tactile paper/receipt design system (`#FAF8F5` bg, charcoal `#141416`, botanical green accents) before building flows.
3. **State-machine UX**: every flow (login, scan, admin) is modeled as an explicit state machine orchestrated by an orchestrator page with `AnimatePresence` transitions.
4. **Evidence-chain integrity**: each audit produces a tamper-evident `evidenceHash` + `dossierNumber` linking image → OCR snippet → measured/required value → legal citation.
5. **Status lifecycle**: reports move `Under Review → Notice Drafted → Compounded` with community voting surfacing high-priority violations to officers.

### Working Prototype
Fully functional; run locally:

```bash
bun install
bun run dev   # → http://localhost:3000
```

Routes: `/` landing, `/login` auth, `/dashboard` community, `/admin` enforcement, `/check` UX playground. Live keys for Clerk/Supabase already wired in `.env.local`.
