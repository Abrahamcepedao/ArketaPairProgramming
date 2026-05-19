# Arketa Booking — Support Engineering Exercise

You're stepping into a simplified class-booking app that's been limping along. Support has been collecting complaints, product has a couple of asks, and the team wants you to steady the ship.

## Objective

1. Investigate what's going wrong.
2. Fix it end-to-end.
3. Ship a small feature improvement.

The interviwer will let you know in which part of the exercise you can use AI tools. We care most about how you reason, debug, and communicate trade-offs.

## Run it

```bash
yarn install
yarn dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Reported support tickets

These came in from customers and the support team over the last couple of weeks. They're written the way tickets actually arrive — vague, symptom-first, sometimes with the user's own theory baked in. Some may share a root cause; some may be describing something other than what they think. **Treat them as symptoms, not specs.**

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
