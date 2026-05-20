# MSME Project Handover for Codex

Last updated: 2026-05-20

This file is a quick context pack for new Codex sessions.

## 1) Project Structure

- Frontend repo: `C:\Users\user\Desktop\18-05-2026-MSME\msme_project`
- Backend repo: `C:\Users\user\Desktop\18-05-2026-MSME\MSME_Backend`
- Backend DB: Prisma + PostgreSQL

## 2) Startup Commands

Frontend:

```powershell
cd C:\Users\user\Desktop\18-05-2026-MSME\msme_project
npm install
npm run dev
```

Backend:

```powershell
cd C:\Users\user\Desktop\18-05-2026-MSME\MSME_Backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

## 3) Important Env Variables

Backend (`MSME_Backend/.env`):

- `PORT=8080`
- `DATABASE_URL=postgresql://<user>:<password>@localhost:5432/msme_db`
- `AUTH_SECRET=<jwt_secret>`
- OTP/SMS keys: `SMS_API_URL`, `SMS_API_KEY`, `SMS_SENDER_ID`, `SMS_TEMP_DLT_ID`
- Google login keys: `GOOGLE_CLIENT_ID`, `GOOGLE_TOKENINFO_URL`
- ArcGIS token keys: `ARCGIS_TOKEN_*`

Frontend (`msme_project/.env`):

- `VITE_SERVER_URL=http://localhost:8080`
- Optional: `VITE_API_BASE_URL`
- `VITE_GOOGLE_CLIENT_ID=<google_client_id>`
- Optional: `VITE_ARCGIS_API_KEY`

## 4) Auth Model

- JWT bearer token in `Authorization: Bearer <token>`
- Token + user stored in localStorage:
  - key `token`
  - key `user`
- Role check:
  - Admin routes require `role` in `["admin","superadmin"]`

Main auth files:

- Frontend: `src/utils/authStorage.js`, `src/routes/ProtectedRoute.jsx`
- Backend: `src/middleware/auth.middleware.js`

## 5) Backend API Surface

Base URL in dev is usually `http://localhost:8080`.

Health:

- `GET /` -> `"Backend is running"`

User/Auth APIs:

- `POST /user/signup`
- `POST /user/login`
- `POST /user/google-login`
- `POST /user/admin-login`
- `POST /user/logout` (auth required)
- `GET /user/me` (auth required)
- `GET /user/admin/session-logs` (admin)
- `GET /user/admin/users` (admin)
- `PATCH /user/admin/users/:id/status` (admin)

OTP APIs:

- `POST /otp/send-otp`
- `POST /otp/verify-otp`

API URL registry APIs:

- `GET /api-url/frontend-config` (public)
- `GET /api-url` (auth)
- `POST /api-url` (admin)
- `PUT /api-url/:id` (admin)
- `DELETE /api-url/:id` (admin)

Data Services APIs:

- `GET /data-services` (auth)
- `POST /data-services` (admin)
- `PUT /data-services/:id` (admin)
- `DELETE /data-services/:id` (admin)

Map proxy API:

- `GET|POST /mapserver/service/:serviceKey/*`
- Protected by auth middleware at server level.
- Resolves `serviceKey` from `ApiUrl` table, then proxies upstream response.

## 6) Frontend API Consumption

Main client:

- `src/api/axios.js`
- In local dev, default base path becomes `/msme_backend/api` when backend URL is local/empty.
- Vite proxy rewrites to backend in `vite.config.js`.

Service wrappers:

- `src/services/authService.js`
- `src/services/apiUrlService.js`
- `src/services/dataServiceService.js`
- `src/services/adminUserService.js`

## 7) GIS / Layer Behavior

- Direct MapServer roots are in: `src/gis/msme/arcgisMapServiceUrls.js`
- Resolver: `src/gis/msme/resolveMapServiceUrl.js`
  - In local dev, HSACGGM URLs are rewritten to `/arcgis` proxy.
- Layer constants: `src/gis/msme/serviceUrlsAndLayers.js`
- ArcGIS request/retry/auth fallback client: `src/gis/msme/queryClient.js`

## 8) DB Tables (Prisma Models)

From `MSME_Backend/prisma/schema.prisma`:

- `User`
- `SessionLog`
- `Otp`
- `ApiUrl`
- `DataService`

## 9) Current Known Issue Pattern

If startup error says Prisma auth failed:

- Check `DATABASE_URL` username/password in `MSME_Backend/.env`
- Ensure local Postgres user exists and has access to `msme_db`
- Test with `npx prisma validate`

## 10) Prompt Template for New Codex Session

Use this when opening Codex in another folder and you still want this project context:

```text
Please read this project handover first and use it as base context:
C:\Users\user\Desktop\18-05-2026-MSME\msme_project\CODEX_HANDOVER.md

Also inspect these codebases:
1) C:\Users\user\Desktop\18-05-2026-MSME\msme_project
2) C:\Users\user\Desktop\18-05-2026-MSME\MSME_Backend

Then help me with: <your task>
```

## 11) Important Note

Codex session memory is not guaranteed across completely new sessions/folders.
This handover file is the reliable way to transfer context quickly.
