# Ledgerfy — Updated Blueprint (RBAC integrated, single unified app)

Below is the full, copy-paste-ready blueprint for **Ledgerfy** — one unified Next.js app (App Router) with modular structure.
I’ve integrated a complete Role-Based Access Control (RBAC) system that blends into every milestone and step. This includes directory tree, data models, API contracts, UI components, middleware, tests and explicit commit-by-commit development instructions.

Read it. Feed it to Cursor. Build it.

---

# Quick summary

Ledgerfy = single Next.js monorepo with modular folders (ledger, projects, dms, compliance, analytics).
Core addition: robust RBAC + user management allowing preset roles and fully customizable role-permission maps. Audit logs and strict firm scoping enforce data separation.

---

# Monorepo structure (single app, modular)

```
/ledgerfy
  /app                      # Next.js App Router pages + server actions
    /dashboard
    /ledger                 # ledger module (Tally import, ledgers)
    /projects               # projects & tasks
    /dms                    # document management & client portal
    /compliance             # compliance calendar & items
    /analytics              # dashboards & reports
    /settings               # org, users, roles, integrations
    /api                    # server-side API route handlers (if separate)
  /components               # shared UI (shadcn primitives)
    /rbac
    /drive
    /tasks
    /forms
    /layout
  /lib                      # helpers: db, auth, rbac, utils
    /db.ts
    /auth.ts
    /rbac.ts
  /models                   # Mongoose schemas
    User.ts
    Firm.ts
    Client.ts
    Role.ts
    Permission.ts
    Project.ts
    Task.ts
    Document.ts
    ComplianceItem.ts
    AuditLog.ts
    LedgerEntry.ts
    TallySync.ts
  /workers                  # BullMQ workers (OCR, reminders, tally)
  /scripts                  # seed, migrations, importers
  /tests                    # unit & e2e tests
  /infra                    # IaC (terraform / cloudformation)
  package.json
  pnpm-workspace.yaml
  tsconfig.json
  .env.example
```

---

# RBAC: design & rules

### Roles (preset)

* `admin` / `partner` — full rights
* `manager` — project & review rights; no billing controls
* `senior` — can review, run reconciliations, produce reports
* `associate` — work on assigned tasks; upload docs
* `client` — limited portal-only access

### Permissions (fine-grained)

Permissions are atomic strings. Example list:

* `org:read`, `org:write`
* `users:invite`, `users:update`, `users:delete`
* `clients:read`, `clients:write`
* `projects:create`, `projects:update`, `projects:delete`
* `tasks:assign`, `tasks:update_status`, `tasks:timelog`
* `documents:upload`, `documents:read`, `documents:download`, `documents:share`, `documents:delete`
* `ledger:read`, `ledger:write`, `tally:import`
* `compliance:read`, `compliance:write`, `compliance:mark_filed`
* `analytics:read`
* `audit:read`

### Role model

Store roles as documents with a permissions array so firms can customize.

`Role` document example:

```json
{
  "_id": "...",
  "firmId": "...",
  "name": "manager",
  "permissions": ["projects:create","projects:update","clients:read","documents:read"]
}
```

### Enforcement

* Middleware checks request user and role permissions for each protected API route.
* Frontend receives current user permissions from `/api/users/me` and adapts UI (hide buttons, prevent actions).
* All DB queries include firm scoping: every query must filter by `firmId`.

### Custom roles

* Admins can create a role by selecting permissions from a checklist UI and save it to the `Role` collection.
* Provide validation to prevent privilege escalation (e.g., only `admin` can create roles granting `users:delete`).

### Invite flow & MFA

* Invite: admin enters email + role → system sends invite link (time-bound JWT) → invited user sets password.
* Optional MFA: TOTP (authenticator app) or SMS OTP. Admin can enforce MFA policy per firm.

### Audit trail

* Every critical action creates an `AuditLog` record: `{ actorUserId, actorRole, action, entityType, entityId, ip, timestamp, meta }`.
* Audit logs are append-only; admins can export them.

---

# Models (key Mongoose schemas — include in `/models`)

Provide these files with exact paths as comments (Cursor rule).

Examples (abbreviated):

**/models/User.ts**

```ts
// FILE: /models/User.ts
import mongoose from 'mongoose';
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  phone: String,
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
  firmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Firm' },
  passwordHash: String,
  mfaEnabled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('User', UserSchema);
```

**/models/Role.ts**

```ts
// FILE: /models/Role.ts
const RoleSchema = new mongoose.Schema({
  firmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Firm', required: true },
  name: { type: String, required: true },
  permissions: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model('Role', RoleSchema);
```

**/models/AuditLog.ts**

```ts
// FILE: /models/AuditLog.ts
const AuditLog = new mongoose.Schema({
  actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actorRole: String,
  action: String,
  entityType: String,
  entityId: String,
  ip: String,
  meta: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('AuditLog', AuditLog);
```

(Other models follow earlier blueprint — include Task, Project, Document, ComplianceItem, LedgerEntry, TallySync.)

---

# API contract additions for RBAC & Users

Key endpoints to implement (place under `/app/api` or `/app/route`):

**Auth & Users**

* `POST /api/auth/login` — email/password -> tokens
* `POST /api/auth/refresh` — refresh token
* `POST /api/auth/invite` — admin invites user `{ email, roleId }`
* `POST /api/auth/accept-invite` — accept invite with token + set password
* `GET /api/users/me` — returns `user` + `role` + `permissions`
* `GET /api/users?firmId=...` — admin-only: list firm users
* `POST /api/users` — admin: create user (invite flow)
* `PATCH /api/users/:id` — admin: update role/status
* `DELETE /api/users/:id` — admin: remove user

**Roles & Permissions**

* `GET /api/roles?firmId=...` — list roles (admin)
* `POST /api/roles` — create custom role (admin)
* `PATCH /api/roles/:id` — update role (admin)
* `DELETE /api/roles/:id` — delete role (admin)

**Audit Logs**

* `GET /api/audit?firmId=...&entityType=...` — admin/audit role

All protected endpoints must carry middleware `requirePermissions(['projects:create'])` or similar.

---

# Frontend: UI components & pages for RBAC

Paths and components to create:

* `/app/settings/users/page.tsx` — User management table (invite, edit role, deactivate)
* `/app/settings/roles/page.tsx` — Role & Permissions builder UI (checkbox grid of permissions)
* `/components/rbac/RequirePermission.tsx` — wrapper component that shows children only if permission present
* `/components/layout/TopNavUserMenu.tsx` — shows current user, role, quick actions (MFA toggle)
* `/app/clients/[id]/page.tsx` — will use server session to ensure client can only view their own clientId

UI behavior:

* Buttons for restricted actions must be hidden if user lacks permission. Do not rely on client-only checks — backend must block too.
* Admin role pages accessible only to users with `users:invite` or `org:write`.

---

# Middleware & helpers

Create `/lib/rbac.ts` and `/lib/auth.ts`:

`rbac.ts` provides:

* `getPermissionsForUser(user)` — returns aggregated permissions based on role doc
* `requirePermission(permission)` — server-side wrapper for API routes and server actions: throws 403 if missing

`auth.ts` provides:

* `getServerUser(req)` — returns authenticated user (session)
* `requireAuth()` — throws 401 if not signed in

Also create `logAction(actor, action, entityType, entityId, meta)` to write AuditLog entries.

---

# Detailed development plan (milestones with explicit steps & commit messages)

Below is the full step-by-step development plan. Each milestone is a focused development task — implement, test, commit and push. Use the exact commit message shown.

---

## Milestone 0 — Pre-flight & repo bootstrap

**What**

* Initialize Next.js app (TS), Tailwind, ShadCN, pnpm workspace
* Setup MongoDB local or Atlas
* Add ESLint, Prettier, husky
  **Commands**

```bash
pnpm create next-app@latest ledgerfy --ts --app
cd ledgerfy
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Commit**

```
chore: bootstrap Next.js app, tailwind and linting configs
```

---

## Milestone 1 — DB + Auth + User model

**What**

* Add `/lib/db.ts` (mongoose connect)
* Implement NextAuth (or custom JWT). For speed use NextAuth with Credentials provider + email invite flow.
* Create `User` and `Firm` models.
* Seed admin user script.
  **Files**
* `/lib/db.ts`
* `/models/User.ts`, `/models/Firm.ts`
* `/app/api/auth/[...nextauth]/route.ts` or `/app/api/auth/*` routes
  **Commit**

```
feat(auth): add DB connection, nextauth and user/firm models
```

**Tests**

* Unit test for DB connect
* E2E: sign-up flow and admin creation
  **Acceptance**
* Able to create firm and admin user; `GET /api/users/me` returns role

---

## Milestone 2 — Roles & Permissions core

**What**

* Add `Role` model
* Add `/lib/rbac.ts` helper
* Create middleware `requirePermission` for server routes
* Seed default roles (admin, manager, senior, associate, client) with sensible permissions
  **Files**
* `/models/Role.ts`
* `/lib/rbac.ts`
* `/app/api/roles/*` endpoints
  **Commit**

```
feat(rbac): add role model, rbac helper and seeded default roles
```

**Tests**

* Unit tests for permission checks
* Protected API sample: create an endpoint `POST /api/test/protected` require `projects:create`, assert 403 for non-permitted
  **Acceptance**
* Admin can view role list; non-admin cannot create a role

---

## Milestone 3 — User invite & management UI

**What**

* Invite flow API: `POST /api/auth/invite` -> sends invite email with token
* Accept invite API: `POST /api/auth/accept-invite`
* Admin UI: `/app/settings/users/page.tsx` — list, invite, edit role, deactivate
* Ensure audit log on invites & role changes
  **Files**
* `/app/settings/users/page.tsx`
* `/app/api/auth/invite/route.ts`
* `/scripts/seedInvite.ts`
  **Commit**

```
feat(users): add invite flow and user management UI
```

**Tests**

* Invite token expiry; invited user can accept and create password
  **Acceptance**
* Admin invites user; invitee sets password and belongs to firm with assigned role

---

## Milestone 4 — Role builder (custom roles)

**What**

* UI to create custom role by checking permission grid
* Backend endpoint to persist role `POST /api/roles`
* Prevent creation of roles granting `users:delete` unless creator is `admin`
  **Files**
* `/app/settings/roles/page.tsx`
* `/app/api/roles/route.ts`
  **Commit**

```
feat(roles): add custom role builder UI and endpoints
```

**Tests**

* UI form validation; role creation and listing
  **Acceptance**
* Admin creates a role `audit-reviewer` with specific permission set

---

## Milestone 5 — Middleware coverage & firm scoping

**What**

* Add RBAC middleware to all API routes; enforce `firmId` scoping
* Global server action wrapper: `withAuthAndScope(handler)`
* Audit log write for each protected action
  **Files**
* `/lib/middleware.ts`
* Update all existing API route handlers to use middleware
  **Commit**

```
chore(security): enforce rbac middleware and firm scoping for APIs
```

**Tests**

* Attempt cross-firm data access -> assert forbidden
  **Acceptance**
* User from Firm A cannot access Firm B data

---

## Milestone 6 — Document Drive + permissions

**What**

* Implement file upload (Supabase/S3 presigned), metadata Document model
* Document permissions: share to role/user, expiry, watermark option
* UI: Drive list, upload modal, share modal (pick users/roles)
  **Files**
* `/models/Document.ts`
* `/app/dms/*` pages and components
* `/app/api/documents/*` endpoints with permission checks
  **Commit**

```
feat(dms): document drive with upload, metadata and share permissions
```

**Tests**

* Upload -> ensure only permitted users can download
  **Acceptance**
* Associate uploads a doc; partner can download; client cannot unless shared

---

## Milestone 7 — Projects & task engine with RBAC

**What**

* Project & Task models, APIs
* Task permission rules:

  * `tasks:assign` required to assign someone
  * `tasks:update_status` required to change status for tasks not assigned to you
* UI: Kanban with inline permission-based actions
  **Commit**

```
feat(tasks): implement project/task engine with permission checks
```

**Tests**

* User lacking `tasks:assign` cannot assign; user with `tasks:update_status` can close tasks
  **Acceptance**
* Manager assigns tasks; associate completes them

---

## Milestone 8 — Compliance module integration

**What**

* ComplianceItem model & endpoints
* Only users with `compliance:write` can mark filed
* Calendar view and reminder worker
  **Commit**

```
feat(compliance): add compliance items, calendar and reminder worker
```

**Tests**

* Reminder jobs created; user assigned receives notification
  **Acceptance**
* Compliance item transitions to `Ready for Review` when tasks done

---

## Milestone 9 — Ledger / Tally import with RBAC

**What**

* Tally import endpoint restricted to `tally:import` or `ledger:write`
* Parsed ledger entries stored; only users with `ledger:read`/`ledger:write` can view/edit
  **Commit**

```
feat(ledger): add tally CSV/XML import and ledger permissions
```

**Tests**

* Import parser test; verify role-based view control
  **Acceptance**
* Partner imports Tally CSV; staff with ledger read sees entries

---

## Milestone 10 — Audit logs & admin reports

**What**

* Admin pages to read/export AuditLog
* Filters by user, action, date range
* Add retention policy & export to CSV
  **Commit**

```
feat(audit): add audit log viewer and export capability
```

**Tests**

* Audit entries recorded for invites, role changes, document deletes
  **Acceptance**
* Admin exports audit logs for a month

---

## Milestone 11 — MFA, security polish & tests

**What**

* Add TOTP (authenticator) setup for users; enforce per-firm if required
* Rate limiting & brute-force protection on auth endpoints
* Pentest checklist, add CORS and CSP headers
  **Commit**

```
chore(security): add mfa, rate limiting and security headers
```

**Tests**

* MFA setup/verify flow; brute-force protection tested
  **Acceptance**
* Admin enforces MFA; user must use TOTP

---

## Milestone 12 — CI/CD, docs & deployment

**What**

* GitHub Actions: lint, test, build
* Deploy to Vercel (app) and MongoDB Atlas
* Docs: README, OPS, API spec, RBAC guide
  **Commit**

```
ci: add CI pipeline, docs and staging deploy
```

**Acceptance**

* PR triggers CI; staging site accessible with demo data

---

# Testing strategy (RBAC-focused)

* Unit tests: rbac helper, permission checks, role CRUD
* Integration tests: invite -> accept -> permission enforced flows
* E2E: simulate admin invites, client upload, permissioned download
* Coverage target 80% for security-critical modules

---

# Example server-side permission wrapper (pseudo-code)

```ts
// FILE: /lib/rbac.ts
export async function requirePermission(req, res, permission, handler) {
  const user = await getServerUser(req);
  if (!user) return res.status(401).send('Unauthorized');
  const role = await Role.findById(user.roleId);
  if (!role) return res.status(403).send('Forbidden');
  if (!role.permissions.includes(permission)) return res.status(403).send('Forbidden');
  await logAction(user._id, permission, 'API', req.path, { body: req.body });
  return handler(req, res);
}
```

Use this on routes:

```ts
app.post('/api/projects', (req, res) => {
  return requirePermission(req, res, 'projects:create', async () => {
    // create project code
  });
});
```

---

# UX rules for RBAC UI

* Every action button must be gated: hide or disable if permission missing. Prefer hide to reduce confusion.
* Show tooltips like: “You don’t have permission to perform this action. Contact Admin.”
* Admin role pages clearly state consequences: “Changing a role affects what users can access.”
* Provide an audit trail link on sensitive actions (role changes, deletes).

---

# Acceptance criteria (RBAC-specific)

1. Admin can create/modify/delete roles and assign them to users.
2. Users can perform only permitted actions; server rejects any unauthorized API request.
3. Client portal users can only see their client data (strict firm+client scoping).
4. Audit logs record every role/user change, document delete, or filing action.
5. MFA enforcement works and prevents bypass.

---

# Final notes & deliverables for Cursor

* Commit and push each milestone. Use the commit messages provided.
* Include file header comment with full path for every newly created file.
* If Cursor hits government API access blockers, implement the fallback (manual upload + worker parsing) and log the limitation in `docs/ops.md`.
* Provide a `docs/rbac.md` describing roles/permissions and examples for clients to adopt.

Got it. Here’s an **appendable section** for your `blueprint.md` that you can paste directly at the bottom. It introduces **Zoho/Tally-level enhancements** like **file version history, audit trails, and rollback**—so Ledgerfy is competitive without breaking the milestone flow.

---

## 🔄 Extended Core Features (Zoho/Tally Parity)

To ensure Ledgerfy stands strong against Zoho Books and Tally, we’re extending the MVP with the following **enterprise-grade features**:

### 1. File Version History

* Every uploaded file (invoice, ledger report, compliance doc) will have **version tracking**.
* Changes are not overwritten; instead, new versions are stored with timestamps, user ID, and change notes.
* Users can **rollback** to any previous version.

**Implementation Plan:**

* Extend the `files` table in the database with `version`, `parent_file_id`, and `changed_by`.
* Create a `FileHistory` service in `services/fileHistory.ts` to handle versioning logic.
* Add UI in the file manager to show:

  * Latest version (default)
  * Dropdown to view/download/restore previous versions

### 2. Audit Trail / Activity Log

* Every user action (create, update, delete, upload, role change, permission grant) is logged.
* Activity logs are immutable and viewable by Admins for compliance.

**Implementation Plan:**

* Add `audit_logs` table with fields: `id`, `action`, `user_id`, `entity_type`, `entity_id`, `timestamp`, `ip_address`.
* Middleware in API routes automatically logs every sensitive action.
* Admin dashboard screen for “System Logs” with filtering by user, date, or action type.

### 3. Permission-Aware Rollbacks

* Only **Admins or Role-based privileged users** can roll back to older versions.
* Regular users can **view but not restore** previous versions.

### 4. UX Additions for Trust & Clarity

* Use **timeline visualization** for version history (like GitHub commits view).
* Highlight changes with metadata: *“Edited by Ramesh on Aug 28, 2025 at 4:12 PM”*.
* Add **diff view for text-based files (JSON, CSV, DOCX extracts)**.

---

### 📦 Development Milestones (Extended)

* **Commit 11:** Extend database schema (`files` table → add versioning, create `audit_logs` table).
* **Commit 12:** Build `FileHistory` service with APIs (`POST /files/:id/version`, `GET /files/:id/history`, `POST /files/:id/restore`).
* **Commit 13:** Integrate Audit Trail middleware across sensitive routes.
* **Commit 14:** Update File Manager UI with **Version History modal**, rollback button, and user-friendly timeline.
* **Commit 15:** Add Admin-only **System Logs Dashboard** with filtering and export-to-CSV.

---
