# Arketa Booking — Support Engineering Exercise

You're stepping into a simplified class-booking app that's been limping along. Support has been collecting complaints, product has a couple of asks, and the team wants you to steady the ship.

## Objective

1. Investigate what's going wrong.
2. Fix it end-to-end.
3. Ship a small feature improvement.

You're welcome to use AI tools. We care most about how you reason, debug, and communicate trade-offs.

## Run it

```bash
yarn install
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Reported support tickets

These came in from customers and the support team over the last couple of weeks. They're written the way tickets actually arrive — vague, symptom-first, sometimes with the user's own theory baked in. Some may share a root cause; some may be describing something other than what they think. **Treat them as symptoms, not specs.**

---

**#4821 — from customer (forwarded by CX)**

> hi, i booked the morning yoga last week (pretty sure it was the 9am w/ priya) and i got charged twice. i only clicked book once. my friend said it might be cuz the wifi was slow and it retried? could be. anyway pls refund one. second time this has happened to me this month

---

**#4839 — from the HIIT studio manager**

> The studio was oversold for HIIT Express last night — more people on the roster than the room fits. Instructor was not happy. One of the booked people also never showed up which is a separate thing but maybe related? Refunds are piling up. Need to figure out what's letting this slip through.

---

**#4855 — from CX lead**

> Someone just booked yesterday's 7am Sunrise Flow. The class already happened. How is that possible?

---

**#4860 — internal, ongoing**

> Getting recurring reports that bookings "aren't saving." Took a quick look — feels like maybe local state is clearing on us, could be a caching thing or localStorage. Happens after users do a few actions in a row. One user said the count on the page "jumped" after they refreshed, which might be separate, not sure. Worth digging in when someone has time.

---

## Known gaps / open design questions

- Bookings are supposed to be user-specific (the header shows who's booking), but the current system doesn't actually distinguish between users. How you handle this is up to you — call out the trade-offs.
- Users get confused about whether a class is available, full, already booked by them, or in the past. There's no clear signal on the card.

## Feature request — pick ONE and ship it

- **Waitlist** — when a class is full, let users join a waitlist. Show waitlist count on the card. Bonus: when someone cancels, the waitlist decreases.
- **Status labels** — give each class card a clear state (Booked / Available / Full / Past) so users know at a glance what they're looking at. Treat the labels as a small product decision.

## Tips

- Some issues may require repeated or rapid interactions to reproduce.
- The dev-server terminal logs a line on every booking action — worth keeping an eye on.
- Support tickets describe symptoms. **Reproduce before you decide what the root cause is**, and don't trust the user's theory.
- A well-placed fix may require the UI to start surfacing states (errors, "already booked") that it doesn't today — don't stop at "the API now rejects correctly."
- Module-level state in `lib/store.ts` resets on hot-reload; that's fine for the interview.

## What we care about

- **Reproduce first, fix second.** Show us how you confirm a bug before you change code.
- **End-to-end reasoning.** Improve the reliability of the booking system so invalid actions cannot occur — wherever they originate.
- **Trade-offs, out loud.** Talk through the decisions you're making and what you'd do differently with more time.

## Bonus take-home (optional, after the live session)

If you'd like to keep going, push your work to a branch and send us back:

1. a link to the branch, and
2. a short Loom (≤ 8 min) walking us through what you built and why.

**Pick ONE of these tracks:**

- **Track A — Multi-user, end-to-end.** Thread `userId` through the system so that bookings are actually per-user. Add a lightweight "My Bookings" view (a new page or panel) showing the current user's classes, with a "Cancel" that only affects their own booking. Persist per-user state somewhere (localStorage, file, or sqlite — your call). Include 3–5 tests covering the per-user edge cases you think matter most.

- **Track B — Concurrency safety + test coverage.** Make the in-memory store safe against concurrent writes (two tabs clicking Book on the same class at the same moment). Demonstrate the race condition with a failing test, then fix it. Write out the trade-offs of the approach you chose (locking, queue, optimistic concurrency, etc.).

- **Track C — Waitlist with auto-promote.** Build on the live waitlist feature: when someone cancels a full class, automatically promote the first person off the waitlist into the booking. Include an in-app notification or log entry so the promoted user knows. Include 3–5 tests covering ordering, edge cases (promoted user is already booked elsewhere, last person leaves, etc.).

**In your Loom, cover:** what you built, one thing you chose not to do and why, what you'd want to do next with another day.

## Project layout

```
/app
  page.tsx
  layout.tsx
  /components        ClassList, ClassCard, UserSwitcher
  /api
    /classes         GET list
    /book            POST { classId }
    /cancel          POST { classId }
/lib
  api.ts             client fetch helpers
  store.ts           in-memory store
  users.ts           mock users
  validation.ts      class validation helpers
/types.ts
/data.ts             seed data
```
