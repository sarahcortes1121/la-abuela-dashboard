# La Abuela — Executive Dashboard

A first reporting framework for La Abuela (Laguna de Apoyo, Nicaragua). Six tabs —
Overview, Hotel, Restaurant, Financials, Operations, Scorecard — all currently
driven by **sample data** so the framework can be reviewed before wiring up a
real data source.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

## Deploy on Netlify (via GitHub)

1. Push this folder to a new GitHub repo.
2. In Netlify: **Add new site → Import an existing project → GitHub**, pick the repo.
3. Netlify will read `netlify.toml` automatically:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy. Every push to the connected branch will redeploy automatically.

No environment variables or backend are required for this version — it's static,
sample-data only.

## Replacing the sample data

All mock data lives in one place: the `DATA` object at the top of `src/App.jsx`.
It's intentionally isolated from the components so it can be swapped for a real
source (Google Sheets, Airtable, a small API, etc.) without touching any
rendering code — each page component just receives `DATA.<section>` as a prop.

To wire up Google Sheets later, the simplest path is:
- Publish the sheet(s) as CSV, or use the Google Sheets API with a service account.
- Fetch and shape the data into the same object shape `DATA` currently uses.
- Replace the static `DATA` constant with a `useEffect`/`useState` fetch (or a
  small `useSheetData()` hook) that returns that same shape.

## Adding a new dashboard tab

1. Add a data slice to the `DATA` object.
2. Add one entry to the `NAV` array (`id`, `label`, `short` label for mobile, `icon`).
3. Write a `YourPage({ data })` component using the existing `KPICard`,
   `SectionCard`, `LineChartSVG`, `GroupedBarChart`, `HBarList`, `ProgressRing`,
   and `NeedsAttention` building blocks.
4. Add a `case` for it in the `activePage` switch in `App()`.

No authentication or database is included yet by design — this is the reporting
shell, ready to have a real data source and (later) login added on top.
