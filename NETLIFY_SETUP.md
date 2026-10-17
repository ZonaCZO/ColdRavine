# Netlify

The existing Netlify project can serve React, Express Functions and PostgreSQL.

In Project configuration → Environment variables, add for Production / Functions:

- `DATABASE_URL`: the database production **Read and write** connection string.
- `SESSION_SECRET`: a private, stable random value; generate once with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.

Never prefix these variables with `VITE_` and never commit their values.
The local `.env.cloud` file is ignored and is not uploaded to Netlify.

Commit the source changes and push to the linked GitHub repository. Netlify reads
`netlify.toml`, installs server dependencies, builds React and bundles the API.
No separate Vercel project is required.

After deployment, check login, refresh on `/dashboard`, and logout. In a private
window, `/api/auth/me` should return 401 before login and 200 after login.

Session cookies last for the browser session. Their server records are stored in
PostgreSQL with a default 24-hour idle expiry. Expired records are removed when a
new function instance starts. HTTPS cookies are enabled on Netlify; local Vite
development continues with `npm run dev` and `npm run dev --prefix server`.

The API uses the production database URL you configure. Deploy previews should
not be given production database credentials.
