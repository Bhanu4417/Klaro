# Klaro — Mobile-First Food Discovery Authentication

A bespoke, mobile-first authentication experience built for **Klaro**, an AI-powered packaged food scanner and community product discovery platform.

## Design Philosophy

The interface is crafted around a **"modern food app + editorial design + tactile paper/receipt aesthetic"**:

- **Warm Off-White Surface**: `#FAF8F5` background with a subtle, tactile dot-matrix texture.
- **Deep Charcoal Typography & Primary Elements**: `#141416` / `#18181B` for calm contrast.
- **Subtle Botanical Accent**: `#2C7850` / `#65B288` / `#C4E3D0` representing clean nutrition and natural food intelligence.
- **Tactile Card System**: Clean white card (`rounded-3xl` / `rounded-[28px]`) with soft diffused shadows and micro-borders.
- **Restrained Motion**: Fast, physics-based transitions using `framer-motion` for fluid state changes.

---

## Component Architecture

```
src/
├── app/
│   ├── layout.tsx             # Root layout, viewport config & SEO meta
│   └── page.tsx               # Orchestrator & state machine
├── components/
│   ├── auth/
│   │   ├── AuthShell.tsx          # Responsive mobile container (375-430px)
│   │   ├── AuthHeader.tsx         # Animated header with logo, title & taglines
│   │   ├── SocialAuthButton.tsx   # Google, GitHub, Apple OAuth buttons
│   │   ├── Divider.tsx            # Minimalist tactile divider
│   │   ├── EmailAuthForm.tsx      # Switchable email sign-in / sign-up wrapper
│   │   ├── SignInForm.tsx         # Email + password + remember me + recovery
│   │   ├── SignUpForm.tsx         # Sign up with live password strength meter
│   │   ├── ForgotPasswordForm.tsx # Password reset request flow
│   │   ├── ResetSentView.tsx      # Reset link confirmation & resend timer
│   │   ├── ProfileOnboarding.tsx  # Username (@handle), display name, avatar picker
│   │   ├── AuthLoadingState.tsx   # Tactile scanner reticle & laser animation
│   │   ├── AuthErrorState.tsx     # Accessible inline & banner alert states
│   │   └── DevStateSwitcher.tsx   # Interactive floating UX state explorer
│   ├── preview/
│   │   └── AuthenticatedAppPreview.tsx  # Post-login tactile food receipt & feed
│   └── ui/
│       ├── Button.tsx             # Tactile button primitives
│       ├── Input.tsx              # Mobile-friendly accessible inputs
│       ├── Logo.tsx               # Custom Klaro optical viewfinder + leaf mark
│       ├── Badge.tsx              # Botanical & charcoal tag badges
│       └── TactileCard.tsx        # Elevated paper surface container
├── lib/
│   └── utils.ts               # Class merging & validators
├── styles/
│   └── globals.css            # Tailwind directives & tactile styles
└── types/
    └── auth.ts                # TypeScript interfaces
```

---

## Running with Bun

```bash
# Install dependencies
bun install

# Run the development server
bun run dev

# Build for production
bun run build

# Start production server
bun run start
```
