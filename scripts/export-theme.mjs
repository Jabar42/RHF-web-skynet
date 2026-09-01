#!/usr/bin/env node
/**
 * Extracts design tokens from DESIGN.md (Google Labs format) and generates
 * Tailwind v4 @theme CSS custom properties.
 *
 * Generic version: derives --font-display and --font-sans from the typography
 * roles in DESIGN.md (first fontFamily = display, most common = sans).
 *
 * Usage: node scripts/export-theme.mjs [DESIGN.md path] [output.css path]
 */

import { readFileSync, writeFileSync } from "node:fs";
import { load as yamlParse } from "js-yaml";

const designPath = process.argv[2] || "DESIGN.md";
const outputPath = process.argv[3] || "src/styles/design-tokens.css";

const source = readFileSync(designPath, "utf8");

// Extract YAML frontmatter between --- fences
const fmMatch = source.match(/^---\n([\s\S]*?)\n---/);
if (!fmMatch) {
  console.error("No YAML frontmatter found in", designPath);
  process.exit(1);
}

const tokens = yamlParse(fmMatch[1]);

/** Convert a hex or keyword to a CSS value (lowercase hex) */
function colorValue(v) {
  if (typeof v !== "string") return v;
  if (v === "transparent") return "transparent";
  return v.toLowerCase();
}

/** Build @theme lines from DESIGN.md tokens */
function buildTheme(tokens) {
  const lines = ["@theme {"];

  // ── Colors ────────────────────────────────────────────────
  if (tokens.colors) {
    for (const [name, hex] of Object.entries(tokens.colors)) {
      const val = colorValue(hex);
      lines.push(`  --color-${name}: ${val};`);
    }
  }

  // ── Typography → font families ────────────────────────────
  if (tokens.typography) {
    // Regla explícita y determinista:
    //   display = familia del rol hero-heading (fallback: section-title, card-title, primera)
    //   sans    = familia del rol body (fallback: button, metadata, última distinta)
    const famOf = (role) => tokens.typography[role]?.fontFamily || null;
    let displayFont = famOf("hero-heading") || famOf("section-title") || famOf("card-title");
    let sansFont = famOf("body") || famOf("button") || famOf("metadata");

    if (!displayFont || !sansFont) {
      const families = [];
      for (const [, spec] of Object.entries(tokens.typography)) {
        if (spec.fontFamily && !families.includes(spec.fontFamily)) {
          families.push(spec.fontFamily);
        }
      }
      if (!displayFont) displayFont = families[0] || null;
      if (!sansFont) sansFont = families.find((f) => f !== displayFont) || families[0] || null;
    }

    if (displayFont) {
      lines.push(
        `  --font-display: ${JSON.stringify(displayFont)}, serif;`
      );
    }
    if (sansFont) {
      lines.push(
        `  --font-sans: ${JSON.stringify(sansFont)}, ui-sans-serif, system-ui, sans-serif;`
      );
    }
  }

  // ── Border Radius ─────────────────────────────────────────
  if (tokens.rounded) {
    for (const [name, value] of Object.entries(tokens.rounded)) {
      const key = name === "DEFAULT" ? "DEFAULT" : name;
      lines.push(`  --radius-${key}: ${value};`);
    }
  }

  lines.push("}");
  return lines.join("\n");
}

const css = "/* Generated from DESIGN.md — do not edit by hand */\n\n" + buildTheme(tokens) + "\n";

writeFileSync(outputPath, css, "utf8");
console.log("Wrote %d bytes to %s", css.length, outputPath);
