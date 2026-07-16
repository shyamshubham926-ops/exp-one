# Rundown — Post Composer & Draft Desk

A React (Vite) implementation of **Unit 1 / Experiment 1 — Post Composer with
Platform Validation & Draft Management**, built to satisfy the Aim,
Description, all ten points of the Theoretical Explanation, both
sub-experiments (1.1 and 1.2), and Assignments 1–4 exactly as specified in
the experiment document.

## Aim, restated

Compose content with platform-specific character limits, validate input,
select a platform, and save / retrieve / manage drafts entirely on the
frontend, with a simulated (mock) backend.

## Theoretical Explanation → implementation map

| # | Concept in the PDF | Where it's implemented |
|---|---|---|
| 1 | Controlled Components & State Synchronization | `PostComposer.jsx` — the textarea's `value` is bound to `useForm`'s state; every keystroke fires `onChange` → `setValue` → re-render. Single source of truth: UI ⇄ React state. |
| 2 | React Hooks & Custom Hooks | `hooks/useForm.js` (controlled-input logic), `hooks/useDrafts.js` (CRUD + persistence), `hooks/useAsyncStatus.js` (loading/error/success) — each encapsulates one concern so components stay declarative. |
| 3 | Form Validation Strategies (Sync vs Async) | **Synchronous**: `utils/validationStrategies.js` runs on every keystroke (character limits, empty-content checks). **Asynchronous**: `utils/asyncValidation.js` simulates a call to an external content-policy service, run once on Save — mirrors the PDF's distinction precisely. |
| 4 | Platform-Based Business Rules | `PLATFORM_CONFIG` in `validationStrategies.js` — Twitter 280, LinkedIn 3000, Instagram 2200 (caption + hashtag count capped at 30). Rules are data, not `if/else` chains. |
| 5 | Strategy Design Pattern | `validationStrategies` object maps `platform → validation function`, selected dynamically at runtime (`validate(platform, content)`). Adding a platform = one new entry, nothing else changes (Open/Closed Principle). |
| 6 | Loading & Error Handling UI | `hooks/useAsyncStatus.js` exposes explicit `loading`, `error`, `success` state (not just toasts) — rendered inline in `PostComposer.jsx` as `.status-line` blocks, in addition to toast confirmations. |
| 7 | API Interaction (Mock) | `utils/mockApi.js` — `saveDraftMock()` returns a `Promise` that resolves/rejects after a simulated delay, and rejects ~35% of the time on purpose so the retry path is actually exercised. |
| 8 | Toast Notifications | Uses the **`react-toastify`** library, exactly as named in the PDF (`toast.success(...)`, `toast.error(...)`), wired up via `<ToastContainer />` in `App.jsx`. |
| 9 | Retry Logic Patterns & Fault Tolerance | `utils/retry.js` — recursive retry wrapper with a configurable attempt count, used to wrap every `saveDraftMock` call. |
| 10 | Stale Closures, dependency arrays, cleanup & memory leaks | `components/OnAirTimer.jsx` — a live session clock built the *correct* way from the PDF's own example: a functional state updater (`setElapsed(prev => prev + 1)`) to avoid the stale-closure bug, and a cleanup function (`clearInterval`) to avoid the memory leak. |

## Experiment 1.1 / 1.2 → implementation map

- **1.1 Post Composer with Platform Validation**: `PostComposer.jsx`,
  `PlatformSelector.jsx`, `CharacterGauge.jsx` (a dial-style character
  counter, in place of a plain progress bar).
- **1.2 Draft Management**: `hooks/useDrafts.js` (state-based CRUD,
  persisted with `localStorage`), `DraftList.jsx` (list, edit, delete).

## Assignments → implementation map

| Assignment | Requirement | Status |
|---|---|---|
| 1 — Multi-Platform Post Composer | Platform dropdown, dynamic limits, real-time validation, error messages | Done — 3 platforms, live validation, inline error line |
| 2 — Draft Management System | Save / list / edit / delete, `localStorage` persistence | Done — `useDrafts.js` |
| 3 — Strategy Pattern Implementation | Separate validation functions, dynamic selection, easy to extend | Done — `validationStrategies.js` |
| 4 — Mock API Integration (Advanced) | Mock API functions, loading state, retry logic, toast notifications | Done — `mockApi.js`, `retry.js`, `react-toastify`, explicit loading/error/success state |

## Requirements

- Node.js 18 or newer (Node 20 LTS recommended)
- npm (bundled with Node)

## Run it locally on Windows 11 — step by step

1. **Install Node.js**
   - Go to https://nodejs.org and download the **LTS** installer for Windows.
   - Run the installer, accept the defaults, finish.
   - Open **PowerShell** (Start menu → type "PowerShell") and confirm:
     ```
     node -v
     npm -v
     ```
     Both should print a version number.

2. **Unzip the project**
   - Right-click `post-composer-app.zip` → **Extract All…** → choose a
     folder (e.g. `C:\Users\<you>\Documents\post-composer-app`) → Extract.

3. **Open a terminal in the project folder**
   - Open the extracted `post-composer-app` folder in File Explorer.
   - Click the address bar, type `powershell`, press Enter — this opens
     PowerShell already inside that folder. (Or Shift+right-click inside the
     folder → "Open PowerShell window here".)

4. **Install dependencies**
   ```
   npm install
   ```
   Downloads React, Vite, react-toastify, Vitest, ESLint, etc. into
   `node_modules` (roughly 30–60 seconds).

5. **Start the dev server**
   ```
   npm run dev
   ```
   Output looks like:
   ```
   VITE v5.x  ready in 300 ms
   ➜  Local:   http://localhost:5173/
   ```

6. **Open it in your browser**
   - Ctrl+click the `http://localhost:5173/` link, or paste it into
     Chrome/Edge.

7. **Stop the server**
   - Back in PowerShell, press `Ctrl + C`.

### Running the test suite

```
npm test
```
Runs the Vitest suite (12 tests) covering the Strategy Pattern validation
rules, the retry/fault-tolerance wrapper, and the async content-policy check.

### Linting

```
npm run lint
```
Runs ESLint (`eslint-plugin-react` + `eslint-plugin-react-hooks`) across
`src/`.

### Production build (optional)

```
npm run build
npm run preview
```
`npm run build` outputs static files into `dist/`, deployable to any static
host (Netlify, Vercel, GitHub Pages, IIS, etc.). `npm run preview` serves
that built version locally to sanity-check it.

## Project structure

```
post-composer-app/
├─ index.html
├─ package.json
├─ vite.config.js            # includes Vitest test config
├─ .eslintrc.cjs
└─ src/
   ├─ main.jsx
   ├─ App.jsx
   ├─ index.css
   ├─ hooks/
   │  ├─ useForm.js           # #1/#2 — controlled-input hook
   │  ├─ useDrafts.js         # #2 — draft CRUD + localStorage persistence
   │  └─ useAsyncStatus.js    # #6 — explicit loading/error/success state
   ├─ utils/
   │  ├─ validationStrategies.js  # #3 (sync) + #4 + #5 — Strategy Pattern
   │  ├─ asyncValidation.js       # #3 (async) — simulated policy check
   │  ├─ mockApi.js                # #7 — simulated network save
   │  ├─ retry.js                  # #9 — retry-with-backoff wrapper
   │  └─ __tests__/                # Vitest unit tests
   └─ components/
      ├─ PostComposer.jsx
      ├─ PlatformSelector.jsx
      ├─ CharacterGauge.jsx
      ├─ DraftList.jsx
      └─ OnAirTimer.jsx        # #10 — correct useEffect cleanup pattern
```

## Extending it (per the brief's "Future Scope")

- Swap `useDrafts`'s `localStorage` persistence for Redux Toolkit + RTK Query.
- Point `saveDraftMock` at a real Spring Boot (or any REST) backend.
- Add more platforms by adding one entry to `PLATFORM_CONFIG` and
  `validationStrategies` in `src/utils/validationStrategies.js` — nothing
  else needs to change.
