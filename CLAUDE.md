@AGENTS.md

# Krajina — Project Rules

## I18N — MANDATORY

**EVERY text visible to the user MUST go through next-intl.**
**NEVER hardcode user-visible strings in components.**

This includes:
- Button labels, nav links, headings, taglines
- Placeholder text, aria-labels, alt text
- Badge/tag text, copyright, legal links
- Error messages, empty states

**Workflow for every new component:**
1. Add ALL new text keys to `src/messages/sk.json` (primary)
2. Translate and add to `src/messages/cs.json`
3. Translate and add to `src/messages/en.json`
4. Translate and add to `src/messages/uk.json`
5. Use `useTranslations('section')` in the component
6. NEVER commit a component without translations in all 4 languages

**Exceptions (do NOT translate):**
- Phone numbers, email addresses, physical addresses
- URLs and hrefs
- Brand names: "Krajina", "Instagram", "Facebook"
- Technical strings not shown to users (CSS classes, IDs)



## CSS VARIABLES — MANDATORY

**NEVER use hardcoded values for:**
- Colors: `#8B5E3C`, `rgba(20,10,5,0.5)`, `#FFFFFF` — FORBIDDEN
- Shadows: `0 2px 12px rgba(0,0,0,0.6)` — FORBIDDEN
- Font sizes: `14px`, `1.5rem` — FORBIDDEN
- Spacing: `24px`, `2rem` — FORBIDDEN
- Transitions: `0.25s ease` — FORBIDDEN
- Border-radius: `6px` — FORBIDDEN

**ALWAYS use variables from `src/styles/globals.css`:**

```css
/* Colors */
--color-bg, --color-bg-secondary, --color-bg-card
--color-accent, --color-accent-hover
--color-green, --color-green-hover
--color-gold
--color-text, --color-text-muted, --color-white
--color-border, --color-border-hover
--color-overlay

/* RGB channels for rgba() composition */
--color-accent-rgb     → rgba(var(--color-accent-rgb), 0.15)
--color-white-rgb      → rgba(var(--color-white-rgb), 0.12)
--color-bg-rgb         → rgba(var(--color-bg-rgb), 0.9)
--color-hero-dark-rgb  → rgba(var(--color-hero-dark-rgb), 0.55)

/* Text shadows */
--shadow-text-sm  (0 1px 4px rgba(0,0,0,0.4))
--shadow-text-md  (0 1px 8px rgba(0,0,0,0.5))
--shadow-text-lg  (0 2px 12px rgba(0,0,0,0.6))

/* Spacing */
--spacing-xs, --spacing-sm, --spacing-md, --spacing-lg, --spacing-xl

/* Layout */
--container-max, --border-radius-sm, --border-radius-md, --border-radius-lg
--transition, --header-height, --header-visible
```

**If a value is missing from globals.css — add it there first, then use the variable.**
