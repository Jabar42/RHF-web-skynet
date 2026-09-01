---
name: design-guidelines
description: Design guidelines for the RHF portfolio website — colors, typography, spacing, and components. Tokens are defined in DESIGN.md (Google Labs format with YAML frontmatter). Use when implementing UI changes or reviewing design consistency.
---

# Design System: RHF Cartera Inmobiliaria (Premium / Cartagena)

This document defines the visual design system for the RHF portfolio website. It blends the sober authority of a private bank with the warmth of a Cartagena boutique real-estate firm.

**Source of truth:** [`DESIGN.md`](../../DESIGN.md) — [Google Labs design.md](https://github.com/google-labs-code/design.md) format with **machine-readable YAML frontmatter** (design tokens) and a short overview.

---

## 1. Visual Theme & Atmosphere

Premium real-estate identity, base Cartagena. Today sells Zona Norte (Doral); accepts any project.

**Key Characteristics:**
- **Marfil Canvas** (`#F3EFE6`) — warm, luminous off-white; never pure white for large surfaces.
- **Dual Typography**: Cormorant Garamond headings (editorial luxury serif), Montserrat body/UI (clear geometric).
- **Brand Accents**: Camel (`#C2A578`) for luxury highlights, Cuero (`#6B4A2F`) for depth details.
- **Sober Geometry**: 14–28px border-radius; nothing playful.
- **Breathable Spacing**: section spacing 96px, generous whitespace (~20% above standard).
- **Slow Transitions**: 0.5–0.7s ease-in-out for deliberate, premium motion.

For detailed breakdowns, see the reference guides:

- [Color Palette & Roles](references/color-palette.md)
- [Typography Rules](references/typography.md)
- [Component Stylings](references/component-stylings.md)
- [Layout Principles](references/layout-principles.md)

---

## 2. Token Workflow

The DESIGN.md YAML frontmatter is the single source of truth for design tokens. The Tailwind v4 `@theme` block in `src/styles/design-tokens.css` is **generated** from it — never edit that file by hand.

| Command | Purpose |
|---------|---------|
| `npm run export:theme` | Regenerate `src/styles/design-tokens.css` from DESIGN.md |
| `npm run export:theme:tailwind` | Export Tailwind v3 JSON snapshot to `src/styles/tailwind.theme.json` |
| `npm run lint:design` | Lint DESIGN.md for structural errors and WCAG contrast warnings |

**When to regenerate tokens:**
- After adding or renaming a color in DESIGN.md
- After changing typography font families
- After adjusting border-radius or spacing scale
- After adding new component definitions

---

## 3. Quick Reference

| Aspect | Key Values |
|--------|------------|
| Primary Brand | Marino (`#1F2A3D`), Camel (`#C2A578`), Cuero (`#6B4A2F`) |
| Neutral Scale | Near Black (`#1C1C1C`), Text Muted (`#6A6A6A`), Marfil (`#F3EFE6`), Lotus White (`#FFFFFF`) |
| Fonts | **Headings:** Cormorant Garamond (`--font-display`), **UI & Body:** Montserrat (`--font-sans`) |
| Card Radius | 20–28px (`--radius-md` / `--radius-lg`) |
| Button Radius | 14px (`--radius-DEFAULT`) |
| Spacing | 8px base; section spacing 96px |

---

## 4. Do's and Don'ts

### Do

- Use Marfil as the default page background — never pure white for large surfaces
- Pair Cormorant Garamond headings with Montserrat body text — never mix font roles
- Use Marino as the dominant brand color — CTAs, nav, dark contrast sections
- Use Camel only as accent — eyebrows, tags, highlights, hover states
- Use project photography as the emotional carrier — the UI should step back
- Maintain the 8px spacing rhythm — all spacing values multiples of 8px
- Favor slow 0.5–0.7s ease-in-out transitions over abrupt changes
- Ensure 44px minimum touch targets on mobile
- Use sentence case for headings — the brand is sober, not shouty

### Don't

- Don't use pure black (`#000`) for text — Near Black (`#1C1C1C`) is the darkest allowed value
- Don't use Marino for huge flat backgrounds — reserve it for CTAs, nav, and accent moments
- Don't mix more than two brand colors (Marino, Camel, Cuero) in a single view
- Don't use border-radius below 14px for buttons
- Don't use fast transitions (under 0.3s) — the brand feels deliberate
- Don't center-align every layout — asymmetry is intentional and expected
- Don't use ALL CAPS for headings
- Don't skip heading levels — maintain H2 → H3 → H4 hierarchy without gaps
- Don't leave any trace of the template origin (syberloop) — grep `Tp3studio|el cliente|tu sistema` must be clean

---

## 5. When to Use This Skill

- **Implementing UI changes** (new components, page layouts)
- **Reviewing design consistency** across the site
- **Creating content** that needs to follow visual brand guidelines
- **Debugging styling issues** related to colors, spacing, or typography
- **Onboarding new developers/designers** to the RHF design system
- **Updating DESIGN.md** — run `npm run lint:design` after edits and `npm run export:theme` if tokens changed

---

## 6. See Also

- [Workflow: Construcción de nuestra página pública](../../../../vaults/skynet/workflows/construccion-de-nuestra-pagina-publica-landing-chat-con-nuestro-agente.md) — process that this design system feeds into
- Decision: Marca RHF reemplaza a MH — identity source (palette + typography)

---

**Last updated:** 2026-08-28
**Source:** [`DESIGN.md`](../../DESIGN.md) (Google Labs format with YAML frontmatter)
