# AGENTS.md — АКВАТЕРМ Landing Site

## 1. Project Overview

Single-page corporate landing site for **АКВАТЕРМ** (Akvatherm), an engineering systems company in Oryol, Russia. The site markets services in heating, water supply, water treatment, and boiler repair. It collects leads via contact forms and an interactive quiz. No backend is included in this repo — the contact form POSTs to `/api/contact-form` and silently swallows errors if that endpoint is absent.

Live deployment: https://vano-nine.vercel.app

---

## 2. Stack and Runtime

| Layer | Technology | Version |
|---|---|---|
| UI framework | React | 19.2.3 |
| Language | TypeScript | ~5.8.2 |
| Styling | Tailwind CSS | ^4.2.1 |
| Build tool | Vite | ^6.2.0 |
| Icons | Lucide React | ^0.562.0 |
| Utility | clsx, tailwind-merge | devDependencies |
| Node.js | ≥16.0.0 (LTS recommended) | — |
| Package manager | npm | ships with Node |
| Test framework | **None configured** | — |
| Linter/formatter | **None configured** | — |

TypeScript is strict mode (`"strict": true`). No JavaScript files are permitted (`"allowJs": false`). Path alias `@/` maps to the project root directory.

---

## 3. Setup / Run / Test Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Production build → dist/
npm run build

# Preview the production build locally
npm run preview

# Clean reinstall
rm -rf node_modules package-lock.json && npm install
```

> **Note:** The dev server runs on port **3000** (defined in `vite.config.ts`), not 5173 as the README states. Host is `0.0.0.0` so it binds to all interfaces.

**No test or lint scripts exist** in `package.json`. Manual verification is done by running `npm run build` and inspecting `dist/`.

---

## 4. Repository Map

```
vanotest/
├── index.html                  # HTML entry point (Vite template)
├── index.tsx                   # React root mount (wraps App in ModalProvider + StrictMode)
├── App.tsx                     # Root component — assembles all page sections in order
├── types.ts                    # Barrel re-export from types/ (keep for compat)
├── constants.tsx               # Barrel re-export from lib/constants/ (keep for compat)
├── vite.config.ts              # Vite config: port 3000, @/ alias, plugin-react
├── tsconfig.json               # TypeScript config (strict, ES2022, bundler resolution)
├── package.json                # Scripts and dependencies
├── metadata.json               # App metadata (name, description, geolocation permission)
│
├── components/                 # Page-section components (one file per section)
│   ├── Header.tsx              # Sticky nav bar with CTA button
│   ├── Hero.tsx                # Above-the-fold hero with two CTAs
│   ├── Brands.tsx              # Partner/brand logo strip
│   ├── Services.tsx            # Service cards
│   ├── Advantages.tsx          # USP block
│   ├── Process.tsx             # Step-by-step work process
│   ├── Cases.tsx               # Portfolio/case studies
│   ├── Quiz.tsx                # Interactive multi-step quiz → lead
│   ├── FAQ.tsx                 # Accordion FAQ
│   ├── Reviews.tsx             # Client testimonials
│   ├── ContactForm.tsx         # Shared form used inline and in modals
│   ├── Footer.tsx              # Site footer
│   ├── SuccessModal.tsx        # Legacy file (active version in ui/Modal/)
│   ├── PhonePopover.tsx        # Floating phone popover
│   └── ui/                     # Reusable UI primitives
│       ├── Button/             # Button component (variants: primary, danger, etc.)
│       ├── Input/              # Text/tel input with label + error
│       ├── Select/             # Dropdown select
│       ├── Modal/
│       │   ├── Modal.tsx       # Base accessible modal (ESC/overlay close)
│       │   └── SuccessModal.tsx # Auto-closing success notification modal
│       └── index.ts            # Barrel: exports Button, Input, Select, Modal
│
├── contexts/
│   └── ModalContext.tsx        # Global modal state: openModal(), openSuccessModal()
│
├── hooks/
│   └── useForm.tsx              # Generic form hook: state, validation, sanitization, submit
│
├── lib/
│   ├── index.ts                # Barrel: re-exports validation + sanitization
│   ├── constants/              # All textual/data content for sections
│   │   ├── advantages.ts
│   │   ├── brands.ts
│   │   ├── cases.ts
│   │   ├── contacts.ts
│   │   ├── faq.ts
│   │   ├── icons.tsx
│   │   ├── process.ts
│   │   ├── quiz.ts
│   │   ├── reviews.ts
│   │   └── services.ts
│   ├── validation/
│   │   ├── form.validator.ts   # required(), minLength(), compose(), validateForm()
│   │   └── phone.validator.ts  # PhoneValidator.validate() for Russian phone numbers
│   └── sanitization/
│       └── input.sanitizer.ts  # sanitizeInput(), sanitizePhone(), sanitizeObject()
│
├── types/                      # TypeScript type definitions
│
├── public/
│   ├── 1.png                   # Primary hero image
│   ├── privacy-policy.html     # Legal privacy policy page
│   └── sitemap.xml             # SEO sitemap
│
├── dist/                       # Build output (git-ignored, generated by npm run build)
└── .iosm/                      # iosm-cli workspace config (do not edit manually)
```

---

## 5. Development Workflow and Conventions

### Component conventions
- One component per file, named identically to the file (PascalCase).
- Section components live in `components/`; reusable primitives live in `components/ui/`.
- All section components receive callbacks (e.g. `onCtaClick`) from `App.tsx` and call `openModal()` via `useModal()`.

### Content changes
- **All displayed text, data, and copy** lives in `lib/constants/` — edit the matching file there, not inside components.
- `constants.tsx` and `types.ts` at the root are barrel re-exports; do not add logic there.

### Form handling
- Use `useForm` from `hooks/useForm.tsx` for any new form. Supply `initialValues`, `validators`, and an `onSubmit` handler.
- Validators are composed with `compose()` from `lib/validation/form.validator.ts`.
- Phone validation uses `PhoneValidator.validate()` (Russian format).
- Input sanitization happens via `sanitizeInput()` and `sanitizePhone()` from `lib/sanitization/input.sanitizer.ts`.

### Modal management
- All modals are driven by `ModalContext`. Call `openModal(type)` or `openSuccessModal(overrides)` — never manage modal state locally.
- Modal types: `'consultation' | 'engineer' | 'cost'`.

### Path aliases
- Use `@/` for all internal imports (e.g. `import { useModal } from '@/contexts/ModalContext'`).
- Never use relative paths that traverse up more than one level.

### TypeScript
- Strict mode is enforced. No `any` unless unavoidable.
- No `.js` files — TypeScript only.

### Styling
- Tailwind CSS v4 utility classes only. Brand colors: `#1a224f` (primary), `#d71e1e` (accent red).
- Responsive: mobile-first breakpoints (`sm:`, `md:`, `lg:`).
- Scroll-reveal animation: add class `reveal` to elements; `App.tsx` uses `IntersectionObserver` to add `active` class.

### Git / branching
- Default branch: `master`.
- No CI pipeline is configured in this repo.

---

## 6. Troubleshooting / Pitfalls

| Problem | Cause | Fix |
|---|---|---|
| Dev server on wrong port | README says 5173, actual is 3000 | Always check `vite.config.ts` |
| `@/` import not resolving | Alias set in both `vite.config.ts` and `tsconfig.json` — both must be in sync | Verify `paths` in `tsconfig.json` and `resolve.alias` in `vite.config.ts` |
| Contact form silently does nothing | `/api/contact-form` endpoint absent | Expected behavior; form UX completes but data is not stored without a backend |
| `useModal` throws outside provider | `ModalProvider` not wrapping tree | Ensure `ModalProvider` is in `index.tsx` at root |
| Tailwind v4 syntax errors | v4 uses different config API than v3 | No `tailwind.config.js` in this project; Tailwind v4 is configured via CSS/PostCSS only |
| Build fails on TypeScript errors | `strict: true`, no `allowJs` | Fix all type errors before committing; `npm run build` will catch them |
| Images not loading in production | Assets must be in `public/` for static serving or imported in components | Verify file exists in `public/` |
| `dist/` committed accidentally | `dist/` should be in `.gitignore` | Check `.gitignore` and remove from tracking if needed |

---

## 7. Quick Task Playbooks

### Update company contact info (phone, address, email)
Edit: `lib/constants/contacts.ts`

### Add / edit a service card
Edit: `lib/constants/services.ts` — add an entry to the services array.
Component: `components/Services.tsx`

### Add / edit a FAQ item
Edit: `lib/constants/faq.ts`

### Add a new portfolio case
Edit: `lib/constants/cases.ts`

### Change hero headline or CTA text
Edit: `lib/constants/` — look for the relevant hero or section constant file.
Component: `components/Hero.tsx`

### Add a new page section
1. Create `components/MySection.tsx`.
2. Add data to a new file in `lib/constants/`.
3. Import and mount the section in `App.tsx` inside a `<section id="...">` with `scroll-mt-24` and `reveal` classes.

### Add a new modal type
1. Extend the `ModalState.type` union in `contexts/ModalContext.tsx`.
2. Add the title/description text in the render block in `ModalContext.tsx`.
3. Call `openModal('new-type')` from any component via `useModal()`.

### Modify form validation
Edit: `lib/validation/form.validator.ts` or `lib/validation/phone.validator.ts`.
Validators are composed in `components/ContactForm.tsx` via the `validators` object passed to `useForm`.

### Deploy to Vercel (manual)
```bash
npm install -g vercel
vercel login
npm run build
vercel --prod
```

### Add a new reusable UI primitive
1. Create `components/ui/MyComponent/MyComponent.tsx`.
2. Export from `components/ui/index.ts`.