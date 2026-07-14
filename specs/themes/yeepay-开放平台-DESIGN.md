---
version: alpha
name: "YeePay Open Platform Light"
description: "YeePay Open Platform is a Chinese fintech developer portal with a clean light-mode design anchored by a strong blue brand color (#1162e6 / --colors-primary). The layout uses a full-width hero with an illustrated AI mascot (owl), a horizontal top navigation, and structured content sections below. Typography is dual-script: PingFang SC handles all CJK body and UI text while Montserrat provides Latin display weight for the \"YEEPILOT\" hero heading. The design uses TDesign (TDesign component library) tokens extensively, with a well-defined semantic color scale for brand, warning, error, and success states. Elevation is conveyed through subtle black-alpha shadows and brand-blue glow shadows on interactive cards."
colors:
  alert-orange: "#fa541c"
  brand-blue: "#1162e6"
  page-white: "#ffffff"
  surface-gray: "#f2f1f4"
  text-primary: "#000000"
  text-secondary: "#000000"
  white-text: "#ffffff"
typography:
  hero-display-latin:
    fontFamily: "Montserrat"
    fontSize: "48px"
    fontWeight: "700"
    lineHeight: "48px"
  hero-display-cjk:
    fontFamily: "PingFang SC"
    fontSize: "45px"
    fontWeight: "600"
    lineHeight: "56.25px"
  section-heading:
    fontFamily: "PingFang SC"
    fontSize: "36px"
    fontWeight: "500"
    lineHeight: "45px"
  card-title:
    fontFamily: "PingFang SC"
    fontSize: "24px"
    fontWeight: "600"
    lineHeight: "30px"
  subheading-medium:
    fontFamily: "PingFang SC"
    fontSize: "18px"
    fontWeight: "500"
    lineHeight: "22.5px"
  body-regular:
    fontFamily: "PingFang SC"
    fontSize: "16px"
    fontWeight: "400"
    lineHeight: "24px"
  body-small:
    fontFamily: "PingFang SC"
    fontSize: "14px"
    fontWeight: "400"
    lineHeight: "22.75px"
  label-small:
    fontFamily: "PingFang SC"
    fontSize: "12px"
    fontWeight: "400"
    lineHeight: "19.5px"
    letterSpacing: "0.6px"
  montserrat-secondary:
    fontFamily: "Montserrat"
    fontSize: "32px"
    fontWeight: "600"
    lineHeight: "40px"
rounded:
  radius-sm: "3px"
  radius-md: "4px"
  radius-base: "6px"
  radius-lg: "8px"
  radius-xl: "16px"
spacing:
  space-1: "4px"
  space-2: "8px"
  space-3: "12px"
  space-4: "16px"
  space-5: "20px"
  space-6: "24px"
  space-7: "28px"
  space-8: "32px"
  space-9: "40px"
  space-10: "48px"
  space-11: "80px"
  space-12: "100px"
  space-13: "120px"
---

## Overview

YeePay Open Platform is a Chinese fintech developer portal with a clean light-mode design anchored by a strong blue brand color (#1162e6 / --colors-primary). The layout uses a full-width hero with an illustrated AI mascot (owl), a horizontal top navigation, and structured content sections below. Typography is dual-script: PingFang SC handles all CJK body and UI text while Montserrat provides Latin display weight for the "YEEPILOT" hero heading. The design uses TDesign (TDesign component library) tokens extensively, with a well-defined semantic color scale for brand, warning, error, and success states. Elevation is conveyed through subtle black-alpha shadows and brand-blue glow shadows on interactive cards.

**Signature traits:**
- Dual typeface system: Pairs Montserrat and PingFang SC across the type hierarchy.

## Colors

The palette uses 7 validated color tokens across 1 theme profile. Semantic roles stay attached to observed usage so generation agents can choose accents without inventing new color meaning.

**Semantic naming:**
- **action-background** maps to `brand-blue`: Role "background" is grounded by usage context "Primary CTA buttons, active nav underline, links, card border glow, brand accent".
- **surface-background** maps to `page-white`: Role "background" is grounded by usage context "Main page background, card surfaces, modal overlays".
- **content-text** maps to `text-primary`: Role "text" is grounded by usage context "Primary body text, headings, nav labels at 90% opacity".
- **content-background** maps to `alert-orange`: Role "background" is grounded by usage context "NEW badge on announcement ticker, warning highlights".

### Text Scale
- **Text Primary** (#000000): Primary body text, headings, nav labels at 90% opacity. Role: text. {authored: rgb(0, 0, 0), space: rgb, alpha: 0.12}
- **Text Secondary** (#000000): Secondary descriptive text, captions at 60% opacity. Role: text. {authored: rgb(0, 0, 0), space: rgb, alpha: 0.12}
- **White Text** (#ffffff): Text on dark/blue surfaces, button labels on primary buttons. Role: text. {authored: rgb(255, 255, 255), space: rgb}

### Surface & Shadows
- **Alert Orange** (#fa541c): NEW badge on announcement ticker, warning highlights. Role: background. {authored: rgba(250, 84, 28, 0.16), space: rgb, alpha: 0.16}
- **Brand Blue** (#1162e6): Primary CTA buttons, active nav underline, links, card border glow, brand accent. Role: background. {authored: rgb(17, 98, 230), space: rgb}
- **Page White** (#ffffff): Main page background, card surfaces, modal overlays. Role: background. {authored: rgb(255, 255, 255), space: rgb}
- **Surface Gray** (#f2f1f4): Header/nav background, subtle section fills, input backgrounds. Role: background. {authored: rgb(242, 241, 244), space: rgb}

## Typography

Typography uses Montserrat, PingFang SC across extracted hierarchy roles. Keep hierarchy mapped to these token rows before adding decorative type styles.

Mixes Montserrat and PingFang SC for visual contrast. Weight range spans bold, semi-bold, medium, regular. Sizes range from 12px to 48px.

### Font Roles
- **Headline Font**: PingFang SC
- **Body Font**: PingFang SC

### Type Scale Evidence
| Role | Font | Size | Weight | Line Height | Letter Spacing | Stack / Features | Notes |
|------|------|------|--------|-------------|----------------|------------------|-------|
| Hero section Latin display heading (YEEPILOT) | Montserrat | 48px | 700 | 48px | normal | Montserrat, System | Extracted token |
| Hero section CJK heading (智能解决方案助手) | PingFang SC | 45px | 600 | 56.25px | normal | PingFang SC, sans-serif | Extracted token |
| Section-level headings (开放能力丰富，服务高可用保障) | PingFang SC | 36px | 500 | 45px | normal | PingFang SC, sans-serif | Extracted token |
| Card and sub-section titles | PingFang SC | 24px | 600 | 30px | normal | PingFang SC, sans-serif | Extracted token |
| Feature labels, card subtitles | PingFang SC | 18px | 500 | 22.5px | normal | PingFang SC, sans-serif | Extracted token |
| Primary body text, nav items, descriptions | PingFang SC | 16px | 400 | 24px | normal | PingFang SC, sans-serif | Extracted token |
| Secondary body text, metadata, announcement ticker | PingFang SC | 14px | 400 | 22.75px | normal | PingFang SC, sans-serif | Extracted token |
| Badges, tags, small labels with tracked spacing | PingFang SC | 12px | 400 | 19.5px | 0.6px | PingFang SC, sans-serif | Extracted token |
| Secondary Latin display headings | Montserrat | 32px | 600 | 40px | normal | Montserrat, System | Extracted token |

## Layout

Responsive system uses 1 breakpoint tier(s): desktop.

This system uses a 4px base grid with scale values 4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 80, 100, 120.

### Responsive Strategy
- **desktop (Unknown)**: Expand layout density and horizontal composition for wide viewports.

### Spacing System
| Token | Value | Px | Notes |
|------|-------|----|-------|
| space-1 | 4px | 4 | Extracted spacing token |
| space-2 | 8px | 8 | Extracted spacing token |
| space-3 | 12px | 12 | Extracted spacing token |
| space-4 | 16px | 16 | Extracted spacing token |
| space-5 | 20px | 20 | Extracted spacing token |
| space-6 | 24px | 24 | Extracted spacing token |
| space-7 | 28px | 28 | Extracted spacing token |
| space-8 | 32px | 32 | Extracted spacing token |
| space-9 | 40px | 40 | Extracted spacing token |
| space-10 | 48px | 48 | Extracted spacing token |
| space-11 | 80px | 80 | Extracted spacing token |
| space-12 | 100px | 100 | Extracted spacing token |
| space-13 | 120px | 120 | Extracted spacing token |

## Elevation & Depth

Keep depth flat unless validated shadow or interaction evidence appears in the extraction payload. Do not invent shadows beyond this evidence boundary.

### Shadow Evidence
| Shadow Token | Layers | Details |
|--------------|--------|---------|
| n/a | 0 | No validated shadow payload |

### Interaction Signals
| Theme | Signal | Evidence |
|-------|--------|----------|
| Light | backdrop-filter | blur(4px) |
| Light | outline-color | rgb(0, 0, 0) ; oklab(0 0 0) ; oklab(0 0 0 / 0.85098) |
| Light | outline-width | 3px |
| Light | outline-offset | 0px |

## Shapes

Shape language maps directly to rounded tokens. Keep component corners consistent with the role mapping below before introducing bespoke geometry.

### Radius Roles
| Token | Value | Px | Role Mapping |
|------|-------|----|--------------|
| radius-sm | 3px | 3 | Subtle corner |
| radius-md | 4px | 4 | Subtle corner |
| radius-base | 6px | 6 | Subtle corner |
| radius-lg | 8px | 8 | Control corner |
| radius-xl | 16px | 16 | Card corner |

### Geometry Evidence
| Radius Token | Shape | Units |
|--------------|-------|-------|
| radius-sm | 3px | px |
| radius-md | 4px | px |
| radius-base | 6px | px |
| radius-lg | 8px | px |
| radius-xl | 16px | px |

## Components

(none detected)

## Do's and Don'ts

Guardrails protect Dual typeface system without adding unsupported visual claims.

| Do | Don't |
|----|---------|
| Do maintain consistent spacing using the base grid | Don't make unsupported claims about absent visual features |
| Do maintain WCAG AA contrast ratios (4.5:1 for normal text) | Don't mix rounded and sharp corners in the same view |
| Do use the primary color only for the single most important action per screen |  |
| Do verify evidence before writing new design-system guidance |  |

## Responsive Evidence

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Breakpoint 1 | Unknown | (width <= 767.9px) |

## Agent Prompt Guide

### Example Component Prompts
- Create button component using validated primary color role and spacing tokens.
- Create card component with mapped radius role and evidence-backed elevation.
- Create form input component using inferred typography hierarchy and border roles.

### Iteration Guide
1. Start with extracted palette and typography roles only.
2. Map spacing and radius directly from token tables before visual polish.
3. Apply component patterns one section at a time and compare against source intent.
4. Keep elevation claims tied to explicit evidence in output.
5. Iterate with smallest diffs and re-check section hierarchy after each change.
