# CLAUDE.md — Julie Christensen Portfolio
## Standing Instructions for Claude Code

Read this file fully before writing any code. These rules apply for the entire project.

---

## Project Context

You are building a freelance video editor portfolio for **Julie Christensen**, based in Vestfold, Norway. She is a real client. The site must be professional, minimal, and warm. It is not a playground for clever code or flashy UI experiments — every decision should serve clarity and trust.

Refer to the **HLD document** (`julie-christensen-portfolio-HLD.md`) for full specifications. Refer to **`copy.md`** for all written content. Do not invent copy, bios, or service descriptions — always pull from `copy.md`.

---

## Tech Stack — Do Not Deviate

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript — strict mode on, no `any`
- **Styling:** Tailwind CSS only — no inline styles, no CSS modules, no styled-components
- **CMS:** Sanity v3
- **Forms:** Formspree
- **Animations:** Framer Motion for entrance animations and lightbox only — do not add animation libraries for anything else
- **Package manager:** npm

If you feel a different tool would be better, flag it with a comment and a reason — do not just swap it in.

---

## Project Structure

```
/
├── app/
│   ├── layout.tsx          # Root layout — fonts, theme provider, cookie banner
│   ├── page.tsx            # Home (scrolling sections)
│   ├── portfolio/
│   │   └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── services/
│   │   └── page.tsx
│   └── contact/
│       └── page.tsx
├── components/
│   ├── ui/                 # Reusable primitives (Button, Tag, Card, Modal)
│   ├── layout/             # Nav, Footer, ThemeToggle, CookieBanner
│   └── sections/           # Page-level sections (Hero, FeaturedWork, etc.)
├── lib/
│   ├── sanity/             # Sanity client, queries, types
│   └── utils.ts
├── sanity/
│   ├── schema/             # All document type schemas
│   └── sanity.config.ts
├── public/
│   └── fonts/              # Self-hosted fonts if applicable
├── styles/
│   └── globals.css         # CSS custom properties for colour tokens only
├── CLAUDE.md               # This file
├── copy.md                 # All site copy — source of truth for text content
└── julie-christensen-portfolio-HLD.md
```

Keep this structure. Do not create files outside of it without flagging first.

---

## Colour Tokens

Never hardcode colour hex values in components. Always use the CSS custom properties defined in `globals.css`. This is what makes the dark/light toggle work correctly.

```css
/* Use these — never raw hex values in components */
var(--bg-primary)
var(--bg-secondary)
var(--border)
var(--accent)
var(--text-primary)
var(--text-secondary)
```

In Tailwind, map these via `tailwind.config.ts`:

```ts
colors: {
  'bg-primary': 'var(--bg-primary)',
  'bg-secondary': 'var(--bg-secondary)',
  'border-color': 'var(--border)',
  'accent': 'var(--accent)',
  'text-primary': 'var(--text-primary)',
  'text-secondary': 'var(--text-secondary)',
}
```

Then use `bg-bg-primary`, `text-accent`, etc. in components.

---

## Typography Rules

| Role | Font | Tailwind class pattern |
|------|------|----------------------|
| Display / headings | The Seasons | `font-seasons` |
| Monospace labels, tags, nav | JetBrains Mono | `font-mono` |
| Body copy | System sans-serif | `font-sans` (default) |

- **The Seasons** — self-host in `/public/fonts/`. If not yet available, use `Cormorant Garant` from Google Fonts as a stand-in and leave a `// TODO: swap to The Seasons` comment.
- **JetBrains Mono** — load via Google Fonts (`next/font/google`).
- Never use a heading font for body copy. Never use body font for display headings.

---

## Component Rules

### General
- Every component must be typed with TypeScript interfaces — no implicit props
- Use named exports for components, default exports for pages only
- Keep components small and single-purpose — if a component exceeds ~120 lines, split it
- No component should fetch its own data — data fetching happens at the page level and is passed as props

### Buttons
Always use the `Button` component from `components/ui/Button.tsx`. Never write a raw `<button>` or `<a>` styled inline. The Button component should support `variant` prop: `'primary' | 'ghost' | 'link'`.

### Images
Always use `next/image` — never a raw `<img>` tag. Every image needs a meaningful `alt` attribute. For placeholders, render a styled `<div>` with initials or a gradient — not a broken image state.

### Links
Use `next/link` for all internal navigation. Never use `<a href>` for internal links.

---

## Placeholder Strategy — Important

Many assets are not ready yet (profile photo, thumbnails, showreel, social links, testimonials beyond 1). Every missing asset must have a **clean, designed placeholder** — not a grey box, not broken, not lorem ipsum.

| Missing asset | What to render instead |
|---------------|----------------------|
| Profile photo | Soft gradient circle (`#D4A373` → `#BC6C25`) with initials "JC" in The Seasons |
| Project thumbnails | Earthy gradient card (`#EFDCAC` → `#D4A373`) with project title overlaid in The Seasons |
| Showreel | Do not render the video section — hide it entirely with a comment: `{/* SHOWREEL: hidden until reel is ready — uncomment section below */}` |
| Social links | Do not render social icons — leave an empty array in Sanity siteSettings |
| Additional testimonials | Section renders fine with 1 — Sanity query returns however many exist |

---

## Sanity CMS Rules

- All content that Julie will ever need to update must live in Sanity — not hardcoded
- This includes: projects, services, testimonials, bio, profile photo, email, social links
- The only things hardcoded are: site structure, navigation labels, and UI chrome
- Studio route: `/studio` (via `next-sanity`)
- Use GROQ queries in `/lib/sanity/queries.ts` — never inline GROQ strings in components
- Always define TypeScript types for Sanity responses in `/lib/sanity/types.ts`

---

## Dark / Light Mode

- Implement using a `ThemeProvider` context component
- Persist preference to `localStorage` under key `'julie-theme'`
- Default to `'light'` if no preference is set
- Apply theme by toggling a `data-theme="dark"` attribute on `<html>`
- The CSS custom properties switch based on this attribute — see HLD for values
- The toggle button lives in the top-right of the nav on all pages

---

## Forms & Contact

- Use Formspree for the contact form — endpoint ID will be provided, use env var `NEXT_PUBLIC_FORMSPREE_ID`
- Validate all fields client-side before submission (use controlled inputs + state, not a form library)
- Show inline field errors — not an alert or toast
- Show a success state inline after submission — do not redirect
- The file upload field accepts video files and PDFs only, max 10MB — display this limit in the UI

---

## Animations

- Use Framer Motion for:
  - Section entrance animations (fade-up, triggered by scroll — use `whileInView`)
  - Lightbox open/close transition
  - Dark/light mode colour transitions via CSS (not Framer)
- **Do not** use Framer Motion for hover states — use Tailwind `hover:` classes
- `whileInView` animations must use `viewport={{ once: true }}` — animations fire once only, not every time the element scrolls in and out
- Default entrance animation: `opacity: 0, y: 20` → `opacity: 1, y: 0`, duration `0.5s`, easing `easeOut`
- Stagger children in sections by `0.1s` using `staggerChildren`

---

## SEO

- Every page must have a `generateMetadata` function (App Router pattern)
- Do not use the old `<Head>` pattern
- Open Graph image: use a static OG image at `/public/og-image.jpg` [PLACEHOLDER — generate a simple branded one]
- `lang="en"` on the root `<html>` element
- Ensure all pages have unique, descriptive titles following the pattern: `Page Name — Julie Christensen | Freelance Video Editor`

---

## GDPR / Cookie Consent

- A `CookieBanner` component must render on first visit
- It appears fixed at the bottom of the screen
- It must have Accept and Decline options
- Preference is persisted to `localStorage` under key `'julie-cookie-consent'`
- At launch there are no analytics cookies — the banner is there for compliance and future-proofing
- A Privacy Policy page route `/privacy` must exist — content is a placeholder until a proper policy is written

---

## Code Style

- No `console.log` left in committed code — use `// DEBUG:` comments if you need to flag something
- No commented-out blocks of dead code — use `// TODO:` with a reason if something is deferred
- Prefer `const` over `let`, never `var`
- Async data fetching in server components — no `useEffect` for data fetching
- All environment variables prefixed `NEXT_PUBLIC_` for client-side, plain for server-side
- Keep `globals.css` minimal — only CSS custom properties and base resets. All other styling is Tailwind

---

## What NOT to Do

- Do not use `any` in TypeScript
- Do not hardcode hex colours in components
- Do not use raw `<img>`, `<a>`, or `<button>` tags — use the Next.js and component equivalents
- Do not add any npm package without a clear reason — keep dependencies lean
- Do not invent copy, bios, or service text — always use `copy.md`
- Do not add features not in the HLD without flagging them first
- Do not add a blog, shop, social feed, or any Section 13 "out of scope" feature
- Do not use a CSS framework other than Tailwind
- Do not use `useEffect` for data fetching

---

## Environment Variables

Create a `.env.local` file. Required variables:

```
NEXT_PUBLIC_FORMSPREE_ID=        # Formspree form endpoint ID
NEXT_PUBLIC_SANITY_PROJECT_ID=   # Sanity project ID
NEXT_PUBLIC_SANITY_DATASET=      # production
SANITY_API_TOKEN=                # Read token for server-side fetching
```

Never commit `.env.local`. Ensure `.gitignore` includes it.

---

## Future Hooks — Build These, Don't Activate

These must exist in the codebase but be dormant at launch:

```
// FUTURE: Norwegian i18n — next-i18next scaffolded, not activated
// FUTURE: Stripe — payment component stubbed in /components/ui/PaymentButton.tsx
// FUTURE: Analytics — placeholder in layout.tsx, commented out
// FUTURE: Blog — Sanity schema defined, no route created yet
// FUTURE: Social links — array in Sanity siteSettings, renders nothing if empty
// FUTURE: Showreel — full section written, wrapped in feature flag comment
```

---

## Definition of Done

Before considering any task complete, verify:

- [ ] TypeScript compiles with no errors (`npm run build`)
- [ ] No `any` types
- [ ] All colours use CSS custom properties
- [ ] Component has TypeScript interface for props
- [ ] Placeholder states are clean and intentional
- [ ] Dark mode tested manually
- [ ] Mobile layout checked at 375px width
- [ ] No raw `console.log` in code
- [ ] Copy sourced from `copy.md`, not invented
