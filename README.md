# Daily World Briefing

Daily World Briefing is an editorial-style homepage for a high-signal daily read covering world news, business, innovation, AI and technology, business ideas, education, policy, and a daily quote/history moment.

## What's included

- Responsive editorial homepage for desktop and mobile
- World, Business, Innovation, AI & Tech, Ideas, Education, and Policy topic filters
- Search across the briefing content
- Bookmark interactions for article cards
- Mobile navigation menu
- Daily quote and “On this day” history section
- Newsletter signup validation and success state
- Responsive CSS artwork for article panels
- Accessible labels and reduced-motion support

## Important note about content

The current build uses curated sample editorial content. It does not yet connect to a live news, AI product, or history API. The content arrays are intentionally easy to replace in `src/App.tsx`.

## Run inside the Replit workspace

From the workspace root:

```bash
pnpm install
pnpm --filter @workspace/daily-world-briefing run dev
```

The Replit artifact workflow supplies `PORT` and `BASE_PATH` automatically. For a local production build:

```bash
BASE_PATH=/ PORT=5173 pnpm --filter @workspace/daily-world-briefing run build
```

## Source map

```text
src/App.tsx                    Main page, sample content, filters, search, bookmarks, signup
src/index.css                  Theme tokens, typography, responsive layout, motion, artwork
src/main.tsx                   React entry point and providers
src/components/               Error boundary and reusable UI primitives
src/hooks/                     Shared hooks used by the scaffold
src/pages/not-found.tsx        Fallback route
public/                        Favicon and robots file
vite.config.ts                 Vite and Replit preview configuration
package.json                   Workspace package scripts and dependencies
```

## Connecting live sources later

For real daily updates, add a small backend endpoint rather than calling third-party news services directly from the browser. A typical next step is:

1. Add a typed endpoint in `lib/api-spec/openapi.yaml`.
2. Run the workspace API code generation command.
3. Fetch normalized stories from the frontend using the generated client.
4. Keep the current sample arrays as an explicit loading/empty-state fallback until the source is connected.

Potential source groups include a licensed news provider, a curated AI product feed, a public events/history dataset, and an RSS normalization layer. API keys should be stored as Replit Secrets, never committed to the source tree.

## Verification

The delivered app has been checked with the artifact TypeScript typecheck and the production build. The preview has been checked at desktop and mobile widths.