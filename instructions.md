Cursor Build Instructions — Ledgerfy (Single Unified App)

You are building Ledgerfy, an end-to-end practice management platform for Chartered Accountants and Audit Firms.
This must be built as one unified monorepo (not multiple apps) using Next.js (frontend + backend routes), Node.js APIs, MongoDB (via Mongoose/Prisma if needed), and ShadCN UI.

Tech & Setup

Framework: Next.js 14 (App Router, TS)

Backend: Node.js APIs inside Next.js /api routes

DB: MongoDB (Atlas or local) with Mongoose

Auth: NextAuth.js with Google + Email/Password

UI: ShadCN + TailwindCSS

File Uploads: Supabase Storage (or AWS S3)

Deployment: Vercel (frontend + APIs), MongoDB Atlas (DB), Supabase (files)

Core Modules (all in one app)

Auth & User Management

Login/signup (NextAuth)

Roles: Admin, Staff, Client

Org/workspace setup

Ledger Module (Accounting)

Sync with Tally via CSV import (MVP)

Ledger entries, journal, trial balance

GST reconciliation & filing reminders

Projects Module

Client onboarding, KYC checklist

Project/task tracker

Deadlines with reminders (email + in-app)

Document Management (DMS)

Upload/download files (Supabase/S3)

Client portal: share & request docs

Version control

Compliance Module

GST, ROC, IT filings checklist

Calendar with auto-reminders

Analytics Module

Dashboard: revenue, receivables, deadlines, compliance health

Reports export (PDF/Excel)

Directory Structure (inside one app)
ledgerfy/
 ├─ app/                  # Next.js app router
 │   ├─ dashboard/        # main dashboard
 │   ├─ ledger/           # ledger module
 │   ├─ projects/         # projects module
 │   ├─ dms/              # document mgmt
 │   ├─ compliance/       # compliance module
 │   ├─ analytics/        # analytics dashboard
 │   ├─ settings/         # org & user mgmt
 │   └─ api/              # backend APIs
 ├─ components/           # UI components (shared)
 ├─ lib/                  # helpers (auth, db, utils)
 ├─ styles/               # tailwind config
 ├─ prisma/ or models/    # Mongo schemas
 └─ package.json

Step-by-Step Development (Commit Milestones)
Milestone 1 — Project Setup

Init Next.js (App Router, TS, Tailwind, ShadCN)

Setup MongoDB connection in /lib/db.ts

Configure NextAuth (Google + Email/Password)

Setup roles (Admin, Staff, Client)
Commit + Push: setup: nextjs app, db, auth, roles

Milestone 2 — Dashboard & Layout

Create sidebar + topnav (ShadCN)

Add placeholder pages for: Ledger, Projects, DMS, Compliance, Analytics, Settings

Basic user info in top-right corner
Commit + Push: feat: dashboard layout with module routes

Milestone 3 — Ledger Module (MVP)

Define LedgerEntry schema (date, particulars, debit, credit, balance)

CRUD APIs for ledger entries

UI: add/edit/delete ledger entries

Import Tally CSV (map to ledger entries)
Commit + Push: feat: ledger module with CSV import

Milestone 4 — Projects Module

Define Project schema (client, tasks, deadlines, staff assigned)

CRUD APIs for projects & tasks

UI: Kanban board for tasks

Email reminders for deadlines (sendGrid/Resend)
Commit + Push: feat: projects module with task tracker

Milestone 5 — DMS (Document Management)

File upload via Supabase (drag & drop)

Organize by client/project

Client portal with secure file share
Commit + Push: feat: dms with file upload + client portal

Milestone 6 — Compliance Module

Schema for compliance items (type: GST, ROC, IT; deadline; status)

CRUD APIs

Calendar view + reminders
Commit + Push: feat: compliance module with calendar

Milestone 7 — Analytics

Dashboard page with:

Revenue trends

Pending receivables

Upcoming compliance deadlines

Export to PDF/Excel
Commit + Push: feat: analytics dashboard + reports

Milestone 8 — Settings & Admin

Org setup: Name, Logo, FY start date

User mgmt: invite staff, assign roles

Client mgmt: add clients, assign projects
Commit + Push: feat: settings with org, users, clients

Milestone 9 — Polish & Deploy

Add dark mode toggle

Add loading/error states

Deploy to Vercel (with MongoDB Atlas + Supabase)
Commit + Push: release: ledgerfy mvp deployed

That gives you one unified Ledgerfy app, modular but not fragmented. Cursor can now build each milestone in order and you’ll have a complete working MVP at the end.