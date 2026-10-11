# Admin Portal Implementation Plan

## Design

- **Movement:** warm craft-studio operations console: practical admin tooling softened by Foami Mágico's playful handmade identity.
- **Principles:** operational clarity, visible status, safe destructive actions, and compact mobile-first controls.
- **Color philosophy:** ink for authority and navigation, fucsia for primary actions, lima for healthy/available states, naranja for attention, and blush/card surfaces for calm grouping.
- **Layout paradigm:** a persistent operations rail with metric cards and a responsive product workbench, not a dense spreadsheet-only dashboard.
- **Signature elements:** stitched cards, status pills, and small color-coded inventory indicators.
- **Interaction:** every write explains what changes, validates before submission, confirms archive actions, and reports success/error inline and via toast.
- **Animation:** restrained hover/lift feedback only; respect reduced motion.
- **Typography:** existing Fredoka display headings + Nunito body/UI text.
- **Brand essence:** a friendly craft workshop whose staff can manage real product operations without touching source code; practical, warm, trustworthy.
- **Voice:** direct and reassuring. Example: “Actualiza una pieza sin perder el catálogo público.” / “Cada ajuste de inventario queda registrado.”
- **Wordmark/logo:** reuse the existing Foami Mágico logo assets; no new generic admin branding.
- **Signature color:** Foami fucsia `#ff007f`.

## Project structure

- `migrations/`: persistent product/category/inventory/admin schema and idempotent catalog seed.
- `src/lib/admin/`: server-only authorization, validation, and data access.
- `src/routes/admin.tsx`: protected dashboard UI and forms.
- `src/lib/products.ts`: public product types/read API backed by persistent data.
- `src/lib/quote.ts`: unchanged pricing rules, consuming the shared product model.
- `src/routes/`: public pages remain visually stable while using the authoritative product source.
