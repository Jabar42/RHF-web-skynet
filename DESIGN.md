---
name: "RHF — Cartera Inmobiliaria"
description: "Identidad premium para la cartera inmobiliaria RHF (base Cartagena): paleta marino/camel/cuero/marfil, tipografía dual Cormorant Garamond + Montserrat, geometría orgánica premium y espaciado amplio."

colors:
  primary: "#1F2A3D"
  marino: "#1F2A3D"
  marino-dark: "#161E2B"
  marino-light: "#3A4A66"
  secondary: "#C2A578"
  camel: "#C2A578"
  camel-light: "#D4BC96"
  accent: "#6B4A2F"
  cuero: "#6B4A2F"
  cuero-light: "#8A6A4B"
  surface: "#F3EFE6"
  marfil: "#F3EFE6"
  marfil-dark: "#E9E2D3"
  near-black: "#1C1C1C"
  text-muted: "#6A6A6A"
  lotus-white: "#FFFFFF"

typography:
  hero-heading:
    fontFamily: "Cormorant Garamond"
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: -0.01em
  section-title:
    fontFamily: "Cormorant Garamond"
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.15
  card-title:
    fontFamily: "Cormorant Garamond"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
  metadata:
    fontFamily: Montserrat
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.04em
  button:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: 0.02em

rounded:
  sm: 8px
  DEFAULT: 14px
  md: 20px
  lg: 28px
  full: 9999px

spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 64px
  section: 96px
  gutter: 24px

components:
  card:
    backgroundColor: "{colors.lotus-white}"
    textColor: "{colors.near-black}"
    rounded: "{rounded.lg}"
    padding: 28px
  background-page:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.near-black}"
  surface-alternate:
    backgroundColor: "{colors.marfil-dark}"
    textColor: "{colors.near-black}"
  text-muted:
    textColor: "{colors.text-muted}"
    typography: metadata
  button-primary:
    backgroundColor: "{colors.marino}"
    textColor: "{colors.lotus-white}"
    typography: button
    rounded: "{rounded.DEFAULT}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.marino-dark}"
    textColor: "{colors.lotus-white}"
    typography: button
    rounded: "{rounded.DEFAULT}"
    padding: "14px 28px"
  button-accent:
    backgroundColor: "{colors.camel}"
    textColor: "{colors.marino}"
    typography: button
    rounded: "{rounded.DEFAULT}"
    padding: "14px 28px"
  button-ghost:
    backgroundColor: "{colors.marfil}"
    textColor: "{colors.marino}"
    typography: button
    rounded: "{rounded.DEFAULT}"
    padding: "14px 28px"
  tag-proyecto:
    backgroundColor: "{colors.camel-light}"
    textColor: "{colors.marino}"
    typography: metadata
    rounded: "{rounded.full}"
    padding: "6px 14px"
  tag-disponible:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.marino}"
    typography: metadata
    rounded: "{rounded.full}"
    padding: "6px 14px"
  link:
    textColor: "{colors.marino}"
    typography: body
  link-hover:
    textColor: "{colors.cuero}"
    typography: body
  eyebrow:
    textColor: "{colors.camel}"
    typography: metadata
---

## Overview

El design system de la cartera RHF evoluciona una base de **lujo inmobiliario atemporal** sobre la identidad premium definida en la decisión de marca (marino, camel, café cuero, marfil). Combina la autoridad sobria de un banco privado con la calidez de una firma boutique de Cartagena.

La base es **Marfil** (`#F3EFE6`) — un blanco cálido que da aire y luz, alejado del blanco digital puro. El **Marino** (`#1F2A3D`) ancla los CTAs y fondos de contraste, el **Camel** (`#C2A578`) marca los acentos de lujo y el **Cuero** (`#6B4A2F`) los detalles de profundidad.

**Key Characteristics:**
- **Marfil Canvas** — fondo cálido y luminoso, nunca blanco puro para superficies grandes
- **Dual Typography** — Cormorant Garamond (serif editorial premium) para titulares, Montserrat (geométrica clara) para cuerpo y UI
- **Sobriedad cromática** — máximo 2 colores de marca por vista; el marino domina, el camel acentúa
- **Geometría sobria** — radios 14–28px, nada de formas infantiles
- **Espaciado amplio** — secciones de 96px, aire generoso (inmobiliario premium respira)
- **Transiciones lentas** — 0.5–0.7s ease-in-out, movimiento deliberado
- **Fotografía protagonista** — las fotos de los proyectos llevan la emoción; la UI se retira

## Using This Design System

The YAML frontmatter above is the **machine-readable single source of truth** for design tokens. It generates `src/styles/design-tokens.css` via `npm run export:theme`. Never edit that CSS file by hand.

For detailed implementation guidance — color roles, typography hierarchy, component specs, layout principles, and do's/don'ts — see [`.agents/design-guidelines/SKILL.md`](.agents/design-guidelines/SKILL.md).

Sources: `decisions/marca-rhf-reemplaza-a-mh` (paleta y tipografías), `decisions/stack-web-cartera-astro-cloudflare-workers` (stack).
