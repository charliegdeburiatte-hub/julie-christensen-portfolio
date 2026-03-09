# High-Level Design Document
## Julie Christensen — Freelance Video Editor Portfolio

**Version:** 1.0  
**Status:** Ready for initial build  
**Developer note:** Assets marked [PLACEHOLDER] will be supplied later. Build with clean placeholder states that are easy to swap out.

---

## 1. Project Overview

A minimal, warm, content-first portfolio website for Julie Christensen, a freelance video editor based in Vestfold, Norway. The site's primary job is to communicate authenticity, build trust with potential clients, and drive enquiries via a contact form. It is not a flashy showcase — the work and the copy do the talking.

**Tagline:** *Your story, told with care*  
**Primary goal:** Get visitors to understand what Julie does and reach out  
**Launch scope:** Portfolio MVP — assets and features will be added incrementally

---

## 2. Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js (App Router) | SSG/SSR flexibility, easy Vercel deploy, SEO-friendly |
| Styling | Tailwind CSS | Utility-first, easy to maintain |
| Language | TypeScript | Type safety, easier to extend later |
| Form backend | Formspree | No backend needed, CAPTCHA + auto-reply built in |
| CMS | Sanity.io | Headless CMS so Julie can update portfolio, pricing, testimonials herself without touching code |
| Hosting | Vercel | Free tier, zero-config Next.js deploys |
| Analytics | None at launch — scaffold for later |

---

## 3. Colour Palette

Use CSS custom properties for both themes. The site must support **light mode, dark mode, and a user toggle**.

```css
/* Light Mode */
--bg-primary:     #FEFAE0;  /* Cream — main background */
--bg-secondary:   #EFDCAC;  /* Sandy wheat — cards, sections */
--border:         #D4A373;  /* Caramel — borders, dividers */
--accent:         #BC6C25;  /* Burnt sienna — CTAs, links, hover states */
--text-primary:   #45462A;  /* Dark olive — body text */
--text-secondary: #606C38;  /* Olive green — labels, secondary text */

/* Dark Mode */
--bg-primary:     #45462A;  /* Dark olive — main background */
--bg-secondary:   #606C38;  /* Olive — cards, sections */
--border:         #BC6C25;  /* Burnt sienna — borders */
--accent:         #EFDCAC;  /* Sandy wheat — CTAs, links */
--text-primary:   #FEFAE0;  /* Cream — body text */
--text-secondary: #D4A373;  /* Caramel — secondary text */
```

---

## 4. Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display / Headings | The Seasons | Regular, Bold | Load via self-hosted or Adobe Fonts |
| Monospace accents | JetBrains Mono | Regular | Labels, tags, metadata, nav items |
| Body copy | System sans-serif stack | Regular | `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` — keeps body legible and fast |

**Usage pattern:**
- `The Seasons` → Hero headline, section titles, the name/wordmark
- `JetBrains Mono` → Nav links, category labels, year stamps, skill tags, small UI elements
- `System sans` → All paragraph body copy, form fields, descriptions

---

## 5. Site Structure & Pages

```
/               → Home (single scroll page with anchor sections)
/portfolio      → Portfolio grid (3 projects at launch)
/about          → Short about section (can be on home page)
/services       → Services & pricing
/contact        → Contact form
```

**Navigation links:** Home · Work · About · Services · Contact  
**Light/dark toggle:** Top right of nav

---

## 6. Page Specifications

### 6.1 Home (`/`)

A single scrolling page with the following sections in order:

**a) Hero**
- Large display headline in The Seasons: *"Your story, told with care"*
- One-line sub: *"Freelance video editor — long-form content, podcasts & YouTube"*
- Profile photo [PLACEHOLDER — circular or soft-edged crop]
- Two CTAs: `View My Work` (primary, accent colour) · `Get in Touch` (ghost/outline)
- Subtle scroll-triggered entrance animation on text and image

**b) Featured Work (3 cards)**
- Pull latest 3 projects from Sanity CMS
- Each card: thumbnail [PLACEHOLDER], title, category tag in JetBrains Mono, year
- Click opens a lightbox/modal with embedded video player + project details
- No filtering system needed at launch

**c) About Snippet**
- Short 2–3 sentence intro in warm, conversational tone
- Mention: 3 years experience, specialises in self-help / psychology / podcast content, based in Norway, works internationally
- Link to full About page
- [PLACEHOLDER for photo if separate from hero]

**d) Services Overview**
- 3–4 service cards (short-form, long-form, podcast editing, corporate)
- Each: icon or category label, one-line description, starting price
- CTA: `See Full Services`

**e) Testimonial**
- Single testimonial from Upwork [PLACEHOLDER — text to be supplied]
- Clean pull-quote layout in The Seasons italic
- Attribution: name, platform (Upwork)

**f) Contact CTA Strip**
- Simple full-width section: "Ready to work together?"
- Single button: `Get in Touch`

**g) Footer**
- Name + tagline
- Nav links repeated
- "Built by [your name]" credit *(optional)*
- Cookie consent link
- No social links at launch — leave hooks in code for easy addition later

---

### 6.2 Portfolio (`/portfolio`)

- Clean grid layout — 2 columns desktop, 1 column mobile
- 3 project cards at launch (pulled from Sanity)
- Each card: thumbnail [PLACEHOLDER], title, category, year
- Click → **lightbox/modal** with:
  - Embedded video (YouTube iframe — aspect ratio 16:9 or 9:16 depending on project)
  - Project title
  - Client name
  - Brief description
  - Category tag
  - Year
  - Julie's role (e.g. "Editor")
  - Testimonial snippet (if available)
- No filter system at launch — Sanity schema should include a `category` field so filtering can be added later without a schema migration

---

### 6.3 About (`/about` or section on home)

Julie wants a **short section, not a full page**. Suggest implementing as both:
- A section on the homepage (short version)
- A standalone `/about` route with slightly more detail

**Content to cover:**
- Story / background
- Editing philosophy / approach
- Software: Adobe Premiere Pro, DaVinci Resolve
- Personal interests / personality (keep it warm)
- [PLACEHOLDER for headshot]

**Tone:** Conversational, warm, creative. First person. Not formal.

---

### 6.4 Services (`/services`)

**Services at launch:**
1. Long-form content editing (YouTube, lectures, streams)
2. Short-form / Reels editing
3. Podcast editing
4. Corporate / internal comms

**Per service, display:**
- Service name
- Description of what's included
- Turnaround time [PLACEHOLDER]
- Revisions policy [PLACEHOLDER]
- Starting price

**Pricing:**
- Display publicly
- $20/hr for ongoing/retainer work
- $25/hr for one-off or complex projects
- No packages at launch
- "Contact for a quote" CTA on each service

**Tools section:** Small row of software logos or text badges — Premiere Pro, DaVinci Resolve

---

### 6.5 Contact (`/contact`)

**Form fields:**
- Name (required)
- Email (required)
- Phone (optional)
- Project type (dropdown: Long-form, Short-form, Podcast, Corporate, Other)
- Project deadline (date picker or text)
- Describe your project (textarea, required)
- File / video upload (optional — for briefs or rough cuts)
- Preferred contact method (dropdown: Email, WhatsApp — placeholder for now)

**Backend:** Formspree  
**Submissions go to:** juliechr2013@gmail.com  
**Auto-reply:** Yes — warm, on-brand confirmation message  
**Spam protection:** Formspree honeypot + CAPTCHA

---

## 7. CMS Schema (Sanity)

### `project` document type
```typescript
{
  title: string
  slug: slug
  category: 'long-form' | 'short-form' | 'podcast' | 'corporate'
  year: number
  clientName: string
  role: string
  description: text
  videoUrl: string          // YouTube URL
  aspectRatio: '16:9' | '9:16'
  thumbnail: image          // [PLACEHOLDER]
  testimonial: text         // optional
  published: boolean
  order: number             // for manual ordering
}
```

### `service` document type
```typescript
{
  title: string
  description: text
  turnaround: string
  revisionsPolicy: string
  startingPrice: number
  currency: string
  order: number
}
```

### `testimonial` document type
```typescript
{
  quote: text
  author: string
  platform: string          // e.g. Upwork
  featured: boolean
}
```

### `siteSettings` singleton
```typescript
{
  tagline: string
  bio: text
  profilePhoto: image       // [PLACEHOLDER]
  email: string
  socialLinks: array        // empty at launch, ready to populate
}
```

---

## 8. Animations & Interactions

- **Entrance animations:** Subtle fade-up on scroll for sections (Framer Motion or CSS)
- **Lightbox:** Smooth open/close with backdrop blur
- **Dark/light toggle:** Smooth colour transition (CSS `transition: background-color 0.3s`)
- **Hover states:** Card lift (subtle `translateY(-4px) shadow`) on project cards
- **No heavy parallax or complex scroll effects** — keep it fast and clean
- Performance > spectacle

---

## 9. SEO & Metadata

- English primary language (`lang="en"`)
- Norwegian-friendly: avoid idioms, keep copy clear and internationally readable
- Meta title: *"Julie Christensen — Freelance Video Editor"*
- Meta description: *"Freelance video editor based in Norway, specialising in long-form content, podcasts, and YouTube. Working with creators and brands internationally."*
- Open Graph tags: Yes — title, description, image [PLACEHOLDER]
- Local SEO: Include "Vestfold, Norway" naturally in copy and meta
- `sitemap.xml` and `robots.txt` — generate automatically via Next.js

---

## 10. GDPR & Cookie Consent

- Cookie consent banner required (Norway is EEA — GDPR applies)
- Use a lightweight solution: **Cookieyes** free tier or a custom minimal banner
- At launch: only strictly necessary cookies (Formspree) — no analytics
- Privacy Policy page: generate a basic one and link from footer [PLACEHOLDER — use a GDPR generator for Norway]
- Banner must appear on first visit, persist preference, allow dismiss

---

## 11. Placeholder Strategy

Every missing asset should have a **designed placeholder**, not a broken state:

| Asset | Placeholder approach |
|-------|----------------------|
| Profile photo | Soft olive-toned gradient circle with initials "JC" |
| Project thumbnails | Earthy gradient card with project title overlaid |
| Showreel | Hide hero video section entirely until reel is ready |
| Social links | Omit from UI entirely — hooks in code only |
| Testimonials (more) | Single testimonial displayed, section scales automatically when more added via CMS |

---

## 12. Future-Ready Scaffolding

Build these hooks now even though they won't be active at launch:

- [ ] Social links array in Sanity `siteSettings` (add URLs, they appear automatically)
- [ ] `category` field on projects (enables filtering later with no schema change)
- [ ] Analytics placeholder in `_app.tsx` (uncomment when ready)
- [ ] Stripe integration placeholder in services (comment block with setup instructions)
- [ ] Blog/posts document type in Sanity schema (dormant until needed)
- [ ] `/no` route or `next-i18next` scaffolding for Norwegian translation (dormant)

---

## 13. Out of Scope for Launch

- Full Norwegian translation
- Showreel / demo reel
- Stripe payments
- Blog
- Social media links
- Google Analytics
- Additional testimonials beyond 1
- Client logo strip
- Password-protected galleries

---

## 14. Definition of Done (MVP)

- [ ] All 5 pages render correctly on mobile, tablet, desktop
- [ ] Light/dark mode toggle works and persists via `localStorage`
- [ ] Contact form submits successfully to `juliechr2013@gmail.com` via Formspree
- [ ] Auto-reply email sends on form submission
- [ ] Cookie consent banner appears and persists preference
- [ ] 3 portfolio projects load from Sanity and open in lightbox
- [ ] Sanity Studio accessible and Julie can log in and edit content
- [ ] Deployed to Vercel with a preview URL
- [ ] All placeholder states are clean and intentional (not broken)
- [ ] Passes basic Lighthouse audit (aim for 90+ performance, 100 accessibility)
