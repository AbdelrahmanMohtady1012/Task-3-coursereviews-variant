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
  on your own reviews), ReviewForm (create/edit, behind `ProtectedRoute`).
