# Task 2 (Variant): Course Review Board — with Authentication

Task 1's Course Review Board API (`Task_1_variant_coursereviews_solution`)
extended with the authentication from `Task_2_solution`: JWT login/register
on the server and a React client with a login flow.

## Running it

```
npm run install:all   # installs server/ and client/ (npm workspaces)
npm run dev           # API on :4000, client on :5175
```

Create `server/.env` yourself with:

```
PORT=4000
MONGO_URI=mongodb+srv://review:pass1234@cluster0.0gjhykf.mongodb.net/?appName=Cluster0
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
```

## What was added on top of Task 1

### Server
- `POST /api/auth/register`, `POST /api/auth/login` → `{ token, user }`;
  `GET /api/auth/me` (requires token).
- `middleware/auth.js` — `requireAuth` reads `Authorization: Bearer <token>`,
  verifies it with `JWT_SECRET` and sets `req.user = { id, name }`.
- `User.comparePassword()`; the `password` field stores the bcrypt hash.
- Reviews: reading (`GET /`, `GET /:id`, `GET /summary`) stays public.
  Creating, editing and deleting require a token. `reviewedBy` is set from
  `req.user.id` (sending it in the body is rejected), and only the author of
  a review can edit or delete it (`403` otherwise). Reviews are populated
  with the reviewer's `name`/`email`.
- Users: `POST /api/users` was removed (use `/api/auth/register`);
  `PATCH`/`DELETE /api/users/:id` require a token and only work on your own
  account.

### Client (`client/`, Vite + React + Tailwind)
- `AuthContext` stores the token in `localStorage`, restores the session via
  `/auth/me`, and `api.js` attaches the token to every request.
- Pages: Login, Register, Reviews (list + course summary lookup, edit/delete
  on your own reviews). ReviewForm is left for you — see below.

## Your task — the Write Review page

Everything above is already working. Your job is the frontend of writing a
review: `client/src/pages/ReviewForm.jsx`. It is already routed at
`/reviews/new` and `/reviews/:id`, both behind `ProtectedRoute`, and the
"Write Review" nav link and the "Edit" buttons already point to it.

### TODO 1 — the form
Render inputs bound to the `form` state:
- `courseCode` — text input (e.g. `CS101`)
- `rating` — select with options 1–5 (store it as a **number**, not a string)
- `comment` — textarea (optional)

Implement `onChange` so every input updates `form`.

### TODO 2 — writing a review
In `onSubmit`, send `POST /api/reviews` with `{ courseCode, rating, comment }`
using the `api` instance from `client/src/api.js` (it already attaches your
token). On success, navigate back to `/reviews`. On failure, show the
server's `message` in the `error` box — try it: an invalid rating returns
`400`, reviewing the same course twice returns `409`.

Do **not** send `reviewedBy` — the server takes the reviewer from your token
and rejects the request if you send it.

### TODO 3 — editing a review
When the URL has an `id`, load the review with `GET /api/reviews/:id` and fill
the form with its `courseCode`, `rating` and `comment`. On submit, send
`PATCH /api/reviews/:id` instead of `POST`. Editing someone else's review
returns `403` — show that message too.

You're expected to use AI tools while building this. But you should be able
to explain, for any line in your component, *why* it's there and what
happens if you delete it. We will ask.
