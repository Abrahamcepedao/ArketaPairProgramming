# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A **deliberately buggy** Next.js booking app used as a 45-minute Technical Support Engineer interview exercise at Arketa. The `README.md` is the candidate-facing brief. The bugs, the "light mess," and the missing features are all intentional.

**Before changing anything in this repo, read "Planted bugs" and "Deliberate light-mess" below.** Several things that look like bugs, typos, or oversights are load-bearing for the interview. Do not "helpfully" fix them unless the user explicitly asks you to prepare a solved version.

## Commands

```bash
yarn install
yarn dev      # Turbopack dev server on :3000
yarn build    # production build; runs TS strict type-check
yarn lint     # ESLint via eslint.config.mjs (extends next/core-web-vitals + next/typescript)
```

No test runner is installed. Do not add one unless asked — the original scoping call was "no test scaffold."

## Architecture

- **Next.js 16 App Router + React 19 + TypeScript strict + Tailwind 4.** No external DB, no auth, no persistence beyond process memory.
- **State lives in a single module-level object** in `lib/store.ts`, attached to `globalThis` to survive HMR in dev. `seedClasses()` in `data.ts` computes datetimes relative to `new Date()` at module init, so the seed's "past class" (`sunrise-flow`) always lands in the past no matter when the app runs.
- **The API is the source of truth.** Every mutating route handler (`app/api/book/route.ts`, `app/api/cancel/route.ts`) returns `{ class: updatedClass }` with the authoritative post-mutation state. This is deliberate: it sets up a partial-fix trap where UI-only fixes regress on refresh.
- **Client helpers in `lib/api.ts` currently throw the response away** (`Promise<void>`). This is the planted root cause of Bug 4.
- **Mock users live client-side** (`lib/users.ts`, 3 hardcoded users). `UserSwitcher` is purely presentational — the API ignores identity. This is the "design gap" referenced in the README.
- **`lib/store.ts` logs a breadcrumb on every mutation** (`[book] <id> → X of Y`). The dev-server terminal is part of the intended debugging surface.

## Planted bugs (do not fix without explicit ask)

Bugs are **deliberately spread across multiple files** so the candidate has to navigate, not just scan one function.

| # | Root cause location | Shape |
|---|---|---|
| 1. Double booking | `lib/store.ts` `bookClass` | No per-user tracking; `bookedUsers += 1` unconditionally. API body is `{ classId }` only. |
| 2. Overbooking | `app/api/book/route.ts` | Inline capacity guard is off-by-one: `if (cls.bookedUsers > cls.capacity)` instead of `>=`. Lets through exactly one booking past capacity before it starts rejecting. |
| 3. Past class bookable | Missing check (server `store.ts` *and* client `ClassCard.tsx`). Hint: `lib/validation.ts` exports `isInPast(cls)` that is never imported anywhere. | No date comparison exists in either the book flow or the UI render. The unused helper is the "someone started it and never wired it up" breadcrumb. |
| 4. UI/server desync (presented as "bookings don't persist") | `app/components/ClassCard.tsx` `handleBook` / `handleCancel` + `lib/api.ts` | Handlers call `onLocalUpdate` with client-side arithmetic and discard the API response. The server is correct; the client drifts. |

Additional latent gap (not in a ticket): `lib/store.ts` `cancelBooking` can decrement `bookedUsers` below 0 — strong candidates should catch this while fixing Bug 1. `lib/validation.ts` also exports an unused `isFull(cls)` that, if wired up, cleans up Bug 2 without the off-by-one.

The `README.md` support-ticket framing is deliberately symptom-first and not 1:1 mapped to these root causes — ticket #4860 in particular is a misleading symptom pointing at Bug 4, and ticket #4821 includes a wrong user theory (blaming wifi).

## Deliberate light-mess (do not clean up)

- `ClassCard.tsx` uses `classInfo` as its prop name; `ClassList.tsx` maps over `classes`. Inconsistent by design.
- Stale `// TODO: validate classId exists` comment above the handler in `app/api/book/route.ts`.
- `bookClass` and `cancelBooking` in `lib/api.ts` share a nearly-identical try/catch block.
- `lib/validation.ts` exists with exported-but-unused helpers — realistic "half-finished PR" energy.
- No global error UI; errors go to `console.error`. A complete fix for Bugs 1–3 requires the UI to surface new error states (hinted in the README tips, not stated).

## Features deliberately left unimplemented

The candidate picks ONE of these to ship **during** the live session:

- **Waitlist** — full classes should accept a waitlist; show count; decrement on cancel.
- **Status labels** — per-card state (Booked / Available / Full / Past).

Do not implement either unless the user explicitly asks for a solved reference implementation.

## Bonus take-home (post-interview)

The README ends with a three-track optional bonus the candidate submits as a branch + Loom walkthrough after the live session:

- **Track A** — thread `userId` end-to-end, add a "My Bookings" view, persist per-user state, write 3–5 tests.
- **Track B** — concurrency safety on the in-memory store with a failing test demonstrating the race, then the fix.
- **Track C** — waitlist with auto-promote on cancel, 3–5 tests around ordering and edge cases.

These are the only places where adding a test runner is expected — do not scaffold tests in the base repo.

## Path alias

`@/*` → repo root (see `tsconfig.json`). So `@/lib/store`, `@/types`, `@/lib/users` all resolve from the top of the tree (not from `src/`).
