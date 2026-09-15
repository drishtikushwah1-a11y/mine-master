# Mine Master project guide

## Architecture

This is a framework-free static site. `index.html` contains the semantic page structure, `style.css` contains the complete visual and responsive system, and `script.js` owns practice data and all interactions. There is no backend or package installation.

## Conventions

- Keep content semantic and keyboard accessible.
- Reuse CSS custom properties for themes and shared colors.
- Keep practice mode descriptions and challenges in the `modes` array in `script.js`; cards are rendered from that single source.
- Keep persistence device-local under the `mineMasterTheme` and `mineMasterPersonalBest` localStorage keys.
- Use inline, stroke-based SVG for small interface icons to avoid external asset dependencies.

## Non-obvious decisions

No supplied logo image was present, so the current block-shaped `MM` brand mark is CSS-based. The download URL and community destinations are intentionally non-functional placeholders and show informative toasts. Replace only the marked download anchor when an official world file URL is available.
