# Ledgerfy — Full Blueprint (copy-paste this into `blueprint.md`)

Ledgerfy is a **single, unified web app** for Indian CA firms: ledger + documents + projects + compliance + client portal — with granular RBAC, file versioning, audit trails, Tally import, and a modern, fast UI.

---

## 0) Goals (what we’re building)

* **One app, many modules:** Ledger, DMS (WorkDrive+), Projects/Tasks, Compliance, Analytics, Client Portal.
* **India-first:** GST, TDS, ROC/MCA workflows; date/number formats; client portal localization.
* **Enterprise guardrails:** Firm scoping, RBAC with custom roles, audit logs, MFA, data retention.
* **Modern UX:** Keyboard-first, breadcrumbs, drawers, inline edits, skeleton loading, dark mode.

Non-goals (v1): Payroll, complex inventory, deep CRM. Provide extensibility hooks.

---

## 1) Architecture

**Stack:** Next.js (App Router, TypeScript), MongoDB (Mongoose), Tailwind + shadcn/ui, NextAuth (or Supabase Auth), S3-compatible storage, BullMQ workers (Redis), Vercel deploy.

**App shape:** Single Next.js app; modules are folders with routes + server actions + shared components.

---

## 2) Repository layout

```
/ledgerfy
  /app
    /dashboard
    /ledger
      /import
      /entries
    /projects
      /[projectId]
    /dms
      /files
    /compliance
      /calendar
      /items
    /analytics
    /client-portal
    /settings
      /organization
      /users
      /roles
      /integrations
    /api  # Route handlers if needed beyond server actions
  /components
    /layout         # Header, Sidebar, Breadcrumbs, PageShell
    /ui             # Button, Card, Table, Modal, Drawer, Tabs, Toast
    /rbac           # RequirePermission, PermissionGuard
    /drive          # FileList, Upload, VersionList, ShareDialog
    /tasks          # Kanban, TaskCard, Checklist
    /forms          # Input, DatePicker, Select, FormRow
    /feedback       # Skeletons, EmptyStates, LoadingBar
    /charts         # Bar, Line, Donut
  /lib
    auth.ts         # getServerUser, requireAuth
    db.ts           # mongoose connect
    rbac.ts         # permissions, requirePermission
    scope.ts        # firm scoping helpers
    storage.ts      # S3/Supabase storage, presigned URLs
    audit.ts        # logAction, export
    tally.ts        # CSV/XML parsers
    queue.ts        # BullMQ init
    i18n.ts         # next-intl or i18next config
  /models
    User.ts
    Firm.ts
    Role.ts
    Client.ts
    Project.ts
    Task.ts
    Document.ts
    FileVersion.ts
    ComplianceItem.ts
    LedgerEntry.ts
    TallySync.ts
    AuditLog.ts
    Notification.ts
  /workers
    reminders.ts    # compliance reminders
    ocr.ts          # optional OCR for PDFs
    tally-import.ts # async large imports
  /scripts
    seed.ts
    migrate.ts
  /tests
    unit/
    e2e/
  /public
  /styles
    globals.css
  .env.example
  package.json
  pnpm-lock.yaml
  README.md
```

---

## 3) Data model (Mongoose — abbreviated)

> Include file header comments like `// FILE: /models/User.ts` for Cursor.

**User.ts**

```ts
import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: String,
  phone: String,
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  firmId: { type: mongoose.Schema.Types.ObjectId, ref: "Firm", index: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" }, // for client-portal users
  passwordHash: String,
  mfaEnabled: { type: Boolean, default: false },
  status: { type: String, enum: ["active","suspended"], default: "active" },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("User", UserSchema);
```

**Role.ts**

```ts
const RoleSchema = new mongoose.Schema({
  firmId: { type: mongoose.Schema.Types.ObjectId, ref: "Firm", required: true },
  name: { type: String, required: true },
  permissions: { type: [String], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("Role", RoleSchema);
```

**AuditLog.ts**

```ts
const AuditLogSchema = new mongoose.Schema({
  actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  actorRole: String,
  action: String,             // e.g., "documents.upload"
  entityType: String,         // "Document","LedgerEntry","Role"
  entityId: String,
  firmId: { type: mongoose.Schema.Types.ObjectId, ref: "Firm", index: true },
  ip: String,
  meta: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now }
}, { minimize: false });
export default mongoose.model("AuditLog", AuditLogSchema);
```

**Document.ts + FileVersion.ts**

```ts
const DocumentSchema = new mongoose.Schema({
  firmId: { type: mongoose.Schema.Types.ObjectId, ref: "Firm", index: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
  name: String,
  mimeType: String,
  size: Number,
  storageKey: String,             // current version key
  linked: [{ type: {type:String}, refId: String }], // e.g., {type:"LedgerEntry",refId:"..."}
  permissions: {                  // optional fine-grain doc-level permissions
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    roles: [String]
  },
  version: { type: Number, default: 1 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});
export default mongoose.model("Document", DocumentSchema);

const FileVersionSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document", index: true },
  version: Number,
  storageKey: String,
  size: Number,
  checksum: String,
  notes: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  uploadedAt: { type: Date, default: Date.now }
});
export default mongoose.model("FileVersion", FileVersionSchema);
```

**LedgerEntry.ts**

```ts
const LedgerEntrySchema = new mongoose.Schema({
  firmId: { type: mongoose.Schema.Types.ObjectId, ref: "Firm", index: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", index: true },
  date: Date,
  account: String,
  particulars: String,
  debit: Number,
  credit: Number,
  balance: Number,
  source: { type: String, enum: ["manual","tally","import"] },
  flags: [{ type: String }], // e.g., "anomaly:amount_outlier"
  linkedDocumentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedAt: Date
});
export default mongoose.model("LedgerEntry", LedgerEntrySchema);
```

**ComplianceItem.ts**

```ts
const ComplianceItemSchema = new mongoose.Schema({
  firmId: { type: mongoose.Schema.Types.ObjectId, ref: "Firm", index: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", index: true },
  type: { type: String, enum: ["GST","TDS","ITR","ROC","MCA","OTHER"] },
  period: { fy: String, month: Number, quarter: String },
  dueDate: Date,
  status: { type: String, enum: ["todo","in_progress","ready_for_review","filed","overdue"], default:"todo" },
  assigneeId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  docs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Document" }],
  notes: String,
  filedAt: Date,
  filedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});
export default mongoose.model("ComplianceItem", ComplianceItemSchema);
```

(Other models: Firm, Client, Project, Task, TallySync, Notification — follow the same patterns.)

---

## 4) RBAC and permissions

**Preset roles** (per firm, editable): `admin/partner`, `manager`, `senior`, `associate`, `client`.

**Atomic permissions** (examples):

* Org: `org:read`, `org:write`
* Users: `users:invite`, `users:update`, `users:delete`
* Clients: `clients:read`, `clients:write`
* Projects: `projects:create`, `projects:update`, `projects:delete`
* Tasks: `tasks:assign`, `tasks:update_status`, `tasks:timelog`
* Docs: `documents:upload`, `documents:read`, `documents:download`, `documents:share`, `documents:delete`, `documents:restore_version`
* Ledger: `ledger:read`, `ledger:write`, `tally:import`
* Compliance: `compliance:read`, `compliance:write`, `compliance:mark_filed`
* Analytics: `analytics:read`
* Audit: `audit:read`

**Enforcement:**

* Server: wrap route handlers/server actions with `requirePermission("perm")`, apply firm scoping on every query.
* Client: hide gated UI with `<RequirePermission perms={["..."]}>...</RequirePermission>` (never rely on UI only).

**Custom roles:** Admins compose a role from permissions via a matrix. Guard escalations (only admin can grant `users:*`, `org:write`).

**Audit trail:** Every sensitive action logs to `AuditLog` (actor, action, entity, firmId, ip, meta, timestamp). Export CSV.

**MFA:** TOTP with enforced policy per firm.

---

## 5) APIs (high-level)

Auth/Users:

* `POST /api/auth/login`, `POST /api/auth/refresh`
* `POST /api/auth/invite` (admin) → email/phone invite token
* `POST /api/auth/accept-invite`
* `GET /api/users/me`
* `GET /api/users?firmId=...` (admin)
* `POST /api/users` (admin)
* `PATCH /api/users/:id` (admin) — change role/status
* `DELETE /api/users/:id` (admin)

Roles:

* `GET /api/roles?firmId=...`
* `POST /api/roles` (admin)
* `PATCH /api/roles/:id` (admin)
* `DELETE /api/roles/:id` (admin)

Documents:

* `POST /api/documents` (upload init → presigned URL)
* `GET /api/documents?clientId=...`
* `GET /api/documents/:id`
* **Versioning:** `POST /api/documents/:id/version`, `GET /api/documents/:id/versions`, `POST /api/documents/:id/restore` (admin or `documents:restore_version`)
* **Share:** `POST /api/documents/:id/share`

Ledger:

* `GET /api/ledger?clientId&account&dateFrom&dateTo`
* `POST /api/ledger` (create/edit entries)
* `POST /api/ledger/import/tally` (CSV/XML → queue job)
* `GET /api/ledger/flags?clientId=...` (anomalies feed)

Projects/Tasks:

* `POST /api/projects`, `GET /api/projects?clientId=...`
* `POST /api/tasks`, `PATCH /api/tasks/:id`, `POST /api/tasks/:id/assign`

Compliance:

* `GET /api/compliance?clientId=...`
* `POST /api/compliance`
* `PATCH /api/compliance/:id/status` (requires `compliance:write`)
* `POST /api/compliance/:id/mark-filed` (requires `compliance:mark_filed`)

Audit:

* `GET /api/audit?firmId=...&entityType=...&actor=...&from&to` (admin)

---

## 6) Storage & versioning

* Storage: S3/Supabase bucket per firm; objects named `firmId/clientId/documentId/version`.
* On upload: create `FileVersion` record; bump `Document.version`; update `Document.storageKey`.
* Rollback: check permission; set `Document.storageKey` to target version’s key; create new `FileVersion` with `notes="rollback to vX"`.

---

## 7) Workers (BullMQ)

* `reminders.ts`: nightly cron, find due/overdue compliance, enqueue notifications (email/SMS/push).
* `ocr.ts`: optional, extract text for search.
* `tally-import.ts`: parse large CSV/XML, batch insert, compute balances, flag anomalies.

---

## 8) Tally integration (import path)

* Accept **Tally exported** CSV/XML/Excel. Map to `LedgerEntry` fields with account mapping table per client.
* Validate: dates, amounts, debit/credit integrity, running balance.
* Flag: outliers (z-score), duplicates (same date/amount/particulars), missing counterpart.
* Attach import report (`TallySync` with stats: rows processed, skipped, errors).

---

## 9) Client portal (localization)

* **Audience:** clients upload docs, see status, sign off.
* **Localization:** Hindi + regional (phase). Use next-intl/i18next; keep UI terse. Use number/date locales.
* **Auth:** Client users linked to `clientId`. Scope all queries by `firmId + clientId`.
* **Views:** Overview (status cards), Tasks (requested by CA), Documents (upload with guidelines), Messages/Comments.

---

## 10) Security

* Password hashing (argon2), session hardening, rate limiting on auth.
* MFA TOTP. Device/session list with revoke.
* Signed URLs for downloads; optional watermarking. Virus scan hook (future).
* CSP, CORS, secure cookies, HTTPS only.

---

## 11) Testing

* **Unit:** rbac helpers, scope guards, parsers.
* **Integration:** invite→accept→role enforce; document versioning; ledger import.
* **E2E:** Playwright flows: client portal upload; manager assigns task; admin exports audit logs.
* **Coverage target:** 80% on security-critical libs (`rbac`, `scope`, `audit`).

---

## 12) Development milestones (commit & push messages)

**M0 — Bootstrap**

* Next.js (TS, App Router), Tailwind, shadcn/ui, ESLint/Prettier, Husky.
* `db.ts` Mongo connect.
* **Commit:** `chore: bootstrap app with Next.js, Tailwind, linting`

**M1 — Auth + base models**

* NextAuth (Credentials) or Supabase Auth; User, Firm; `/api/users/me`.
* Seed script for first admin.
* **Commit:** `feat(auth): add auth and user/firm models`

**M2 — RBAC core**

* Role model, seed default roles, `lib/rbac.ts`, `requirePermission`.
* Sample protected route.
* **Commit:** `feat(rbac): roles, permission helper, protected route`

**M3 — User management**

* `/settings/users` table; invite flow; accept-invite; audit log on changes.
* **Commit:** `feat(users): invite & management UI + audit logs`

**M4 — Custom role builder**

* `/settings/roles` with permission matrix; create/update/delete roles.
* Guard escalation.
* **Commit:** `feat(roles): custom role builder with guardrails`

**M5 — Firm scoping + middleware sweep**

* Wrap all APIs with auth+scope; add `withAuthAndScope`.
* **Commit:** `chore(security): enforce firm scoping across APIs`

**M6 — DMS (documents) with versioning**

* Upload (presigned), Document + FileVersion schemas, list, preview, share.
* Version history modal, restore with permission.
* **Commit:** `feat(dms): documents with version history and restore`

**M7 — Projects & tasks**

* Project, Task models; Kanban board; assign/permissions; checklists.
* **Commit:** `feat(tasks): projects and kanban with RBAC`

**M8 — Compliance**

* ComplianceItem CRUD, calendar/list, reminders worker, status gates.
* **Commit:** `feat(compliance): items, calendar, reminders`

**M9 — Ledger + Tally import**

* Ledger entries table with inline edit, filters; Tally CSV/XML import + worker; anomaly flags.
* **Commit:** `feat(ledger): entries, filters, tally import, anomaly flags`

**M10 — Audit & reports**

* Audit log view/export; filters by actor/action/date; retention setting.
* **Commit:** `feat(audit): viewer and export`

**M11 — MFA + hardening**

* TOTP setup/verify, enforcement toggle; rate limit auth; CSP/CORS.
* **Commit:** `chore(security): add MFA and security headers`

**M12 — UI polish pack**

* Global search/command palette; breadcrumbs; toasts; skeletons; empty states; notifications center.
* **Commit:** `feat(ui): command palette, breadcrumbs, skeletons, notifications`

**M13 — Client portal + i18n**

* Client portal routes; localized strings; number/date locale; mobile responsiveness.
* **Commit:** `feat(client-portal): localized client area with uploads and tasks`

**M14 — CI/CD & docs**

* GitHub Actions (lint,test,build); Vercel deploy; docs: ops, API, RBAC.
* **Commit:** `ci: pipeline and deployment docs`

---

## 13) UI/UX blueprint (desktop-first, responsive)

### Design principles

* Clear hierarchy, whitespace, strong typography (Inter). Monospace for numbers in tables (JetBrains Mono).
* Subtle motion that never blocks interaction. Keyboard-first ergonomics.

### Theme tokens (Tailwind via CSS vars)

```css
:root{
  --background: 0 0% 100%;
  --foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --border: 214.3 31.8% 91.4%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --destructive: 0 84.2% 60.2%;
}
.dark{
  --background: 222 47% 11%;
  --foreground: 0 0% 98%;
  --muted: 217.2 32.6% 17.5%;
  --border: 217.2 32.6% 17.5%;
  --primary: 210 40% 98%;
  --primary-foreground: 222 47% 11%;
}
```

Use classes like `bg-[hsl(var(--background))] text-[hsl(var(--foreground))]`.

### Global layout

* **Header:** left logo + breadcrumb, right: search/command `⌘K`, notifications, theme toggle, user avatar.
* **Sidebar:** 280px; collapsible to icon rail (56px) with tooltips. Sections: Dashboard, Ledger, DMS, Projects, Compliance, Analytics, Settings.
* **Page shell:** Title + breadcrumb, optional tabs/filters, content grid.

### Components (Tailwind hints)

* **Card:** `bg-white dark:bg-gray-800 shadow rounded-2xl p-5`
* **Table:** `min-w-full divide-y divide-gray-200 dark:divide-gray-700` + sticky header + row hover
* **Button primary:** `inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500`
* **Drawer:** fixed panel from right `w-[520px]` with `transition-transform`
* **Toast:** fixed bottom-right, `role="alert"`, success/warn/error variants
* **Skeleton:** `animate-pulse bg-gray-200 dark:bg-gray-700 rounded`

### Navigation

* **Breadcrumbs:** Home › Section › Subsection › Page (last item not a link).
* **Tabs:** Secondary nav within module (e.g., Ledger: Entries | Accounts | Imports).
* **Command palette (`⌘K`):** jump to page/action; fuzzy search; shows shortcuts.

### Micro-interactions

* Inline edit: click pencil → input slides in; save (check) flashes green border; cancel restores text.
* Row hover: elevate with subtle shadow; reveal quick actions (view, edit, history).
* Empty states: helpful copy + primary action + mini-illustration.
* Long operations: top progress bar + skeleton in panels; if >10s, show remaining estimation text.

### Loading patterns

* First paint: layout skeleton (cards, rows). Avoid spinner-only.
* Lazy fetch for heavy panels (charts/tables) with independent skeletons.
* Optimistic updates for task status, minor ledger edits; rollback if server rejects.

### Accessibility & keyboard

* Focus rings on all interactive elements (`focus-visible:ring-2 ring-indigo-500`).
* Skip-to-content link in header.
* Keyboard: `g d` dashboard, `g l` ledger, `g c` compliance; `e` edit row; `s` save; `Esc` cancel/close drawers.
* ARIA: `aria-current="page"` on active breadcrumb; `aria-expanded` on collapsible; `role="dialog"` with focus-trap for modals.

---

## 14) Screens: content & behaviors

### Dashboard

* **Top KPIs (cards):** Receivables, Payables, Net Cash, Upcoming Compliance. Each with delta vs prior period and mini-sparkline.
* **Charts:** Cashflow (line), Expense by category (donut), Revenue by client (bar). Hover tooltips; legend toggles.
* **Activity feed:** recent uploads, filings, imports; click to deep-link.
* **AI Insights (panel):** anomalies (e.g., duplicate payments), reminders (filings in 3 days), suggested tasks. “Explain” opens a drawer with rationale + links.

**Interactions:** date range filter, client filter; cards animate number transitions; chart drill-down opens filtered views.

### Ledger

* **Entries table:** columns Date | Account | Particulars | Debit | Credit | Balance | Flags | Docs.
* **Filters panel:** date range, account(s), amount range, flags.
* **Inline edit:** Particulars, Debit/Credit. Save per row; mark dirty rows.
* **Attach docs:** drop zone in Docs cell; badge shows count; click opens file drawer.
* **Flags:** colored chips (e.g., “Outlier”); hover explains; click filters to similar.
* **Imports:** import page → upload Tally CSV/XML → parse preview table → map accounts → run → progress modal → report.

### DMS (WorkDrive+)

* **List/grid:** Name, Type, Size, Modified, Version.
* **Actions:** Upload, New folder, Share, Link to (Ledger/Compliance/Project).
* **Preview:** side drawer previews PDFs/images/text; quick annotate (note pins).
* **Version history:** timeline modal: v1..vN with uploader, timestamp, notes, checksum; diff view for text; restore (permissioned); download any version.
* **Sharing:** to users/roles; expiry; watermark toggle; disable download (view-only).

### Projects & Tasks

* **Kanban:** Backlog | In Progress | Review | Done. Cards: title, assignee avatars, due date chip, labels, checklist progress.
* **Task drawer:** description (markdown), checklist, attachments, comments, audit trail.
* **Bulk ops:** multi-select with sticky action bar (assign, move, labels).

### Compliance

* **Calendar:** month/quarter view; colored dots by status; hover shows mini card.
* **List:** sortable by due date, status, client; quick actions (assign, mark ready, mark filed).
* **Item drawer:** required docs, linked tasks, status timeline; upload area with required placeholders (e.g., “GSTR-3B PDF”).
* **Reminders:** worker creates notifications to assignee and client (if configured).

### Analytics

* **Reports:** GST liability, AR aging, Expense trends, Client profitability.
* **Controls:** compare periods; export CSV/PDF; annotate points; what-if sliders on forecast.

### Settings

* **Organization:** firm profile, logo, locale defaults, fiscal year.
* **Users:** table + invite; row expander for role, MFA status.
* **Roles:** permission matrix; create/edit/delete custom roles; duplication and diff view vs preset.
* **Integrations:** storage provider, email/SMS, webhooks; Tally templates.

### Client Portal (responsive + localized)

* **Overview:** status cards (filings), pending requests, recent documents.
* **Tasks:** checklist of required actions; due dates; attach files.
* **Documents:** upload with guidance; version list; comments thread with CA.
* **Language switcher:** persistent; all dates/numbers localized; simpler copy; larger tap targets.

---

## 15) Extended Zoho/Tally parity (already integrated)

* **File versioning:** immutable history, restore with permissions, notes & checksums.
* **Full audit trail:** per action, filterable, exportable.
* **Linking:** files ↔ ledger/compliance/projects; deep-links from all modules.
* **Smart search:** filenames, version notes, OCR text (future), linked entities.

Milestone deltas (if tracking):

* `feat(dms): versioning APIs + UI`,
* `feat(audit): middleware + admin viewer`,
* `feat(search): global search across files and entities` (if building OCR later).

---

## 16) Performance notes

* MongoDB: compound indexes on `{ firmId, clientId, date }`, `{ firmId, name }`, `{ documentId, version }`.
* Pagination: cursor-based for large tables; avoid `skip` on huge collections.
* Split routes: stream table rows; defer heavy panels with `Suspense`.
* Static assets: image optimization; lazy-load previews.

---

## 17) Deployment

* **Env:** `.env` for DB URI, JWT secret, S3 keys, Redis, EMAIL/SMS providers.
* **CI:** lint → unit → integration → build.
* **Staging seed:** demo firm with fake clients/docs; feature flags for demos.
* **Backups:** nightly Mongo dumps; storage lifecycle rules (archival).

---

## 18) Acceptance criteria (snapshot)

1. Users limited by firm; cross-firm access impossible via API/UI.
2. RBAC blocks unauthorized actions server-side; UI hides gated controls.
3. Document versioning with restore and complete audit entries.
4. Ledger import parses Tally CSV/XML; produces report; flags anomalies.
5. Compliance calendar and reminders working; status transitions logged.
6. Client portal localized with scoped access to own client data.
7. Command palette, breadcrumbs, skeletons, toasts, and dark mode implemented.

---

## 19) Quick Tailwind snippets (for Cursor to reuse)

**Page shell**

```tsx
<div className="flex h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
  <aside className="w-72 shrink-0 border-r border-[hsl(var(--border))] hidden md:block">
    {/* Sidebar */}
  </aside>
  <div className="flex-1 flex flex-col">
    <header className="h-14 px-4 border-b border-[hsl(var(--border))] flex items-center justify-between">
      {/* Breadcrumbs, search, actions */}
    </header>
    <main className="flex-1 overflow-auto p-6">{/* Content */}</main>
  </div>
</div>
```

**Breadcrumbs**

```tsx
<nav aria-label="Breadcrumb">
  <ol className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
    <li><a href="/" className="hover:underline">Home</a></li>
    <li aria-hidden="true">›</li>
    <li><a href="/ledger" className="hover:underline">Ledger</a></li>
    <li aria-current="page" className="text-gray-900 dark:text-gray-100">Entries</li>
  </ol>
</nav>
```

**RequirePermission**

```tsx
export function RequirePermission({ perms, children }: { perms: string[]; children: React.ReactNode }) {
  const user = useCurrentUser(); // from /lib/auth client hook
  return perms.every(p => user.permissions.includes(p)) ? <>{children}</> : null;
}
```

---

## 20) Known bottlenecks & fallbacks

* **Govt data access:** If GSTN/MCA APIs aren’t available, use client-uploaded exports and guided checklists. Log limitation in `docs/ops.md`.
* **Tally variance:** Different export schemas across versions; maintain mapping templates per client; allow admin override in import preview.
* **Large files:** Use multipart uploads; background virus scan; preview generation worker.

---

## 21) Docs to include

* `docs/rbac.md` — roles, permissions, examples.
* `docs/api.md` — endpoint contracts + auth headers.
* `docs/ops.md` — environments, keys, backups, limitations.
* `docs/ui.md` — component catalog, patterns, accessibility checklists.

---

**Ship it.** .
