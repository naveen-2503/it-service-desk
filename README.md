# IT Service Desk & Ticket Management System

A professional, responsive IT Service Desk built with React, TypeScript, and JSON Server. Supports full CRUD ticket management, role-based access control (RBAC), ticket lifecycle management, assignment, comments, resolution tracking, search/filter/sort, and role-specific dashboards.

## Technologies Used

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- JSON Server (mock backend)
- Axios
- React Router DOM
- Git / GitHub

## Features

- **Authentication & RBAC**: Login with role detection (Admin, Support Agent, Employee), route protection, role-based navigation
- **Dashboards**: Role-specific stat cards showing ticket counts by status/priority
- **Ticket Management**: Full CRUD, cursor-free pagination, search by ID/subject/name, filter by status/priority, sort by newest/oldest/priority/recently updated
- **Ticket Lifecycle**: Status transitions gated by role (Employee, Support Agent, Admin each have different allowed transitions)
- **Comments**: Role-gated commenting on tickets
- **Resolution Management**: Support Agents/Admins can resolve tickets with notes
- **Activity Timeline**: Chronological history of ticket events
- **Assignment**: Admin can assign/reassign/unassign tickets to Support Agents
- **User Management**: Admin CRUD on users, activate/deactivate, role assignment
- **Category Management**: Admin CRUD on ticket categories, activate/deactivate
- **Toast Notifications**: Feedback on all create/update/delete/assign/status-change actions
- **Loading, Empty, and Error States** throughout

## Installation

```bash
git clone https://github.com/<your-username>/it-service-desk.git
cd it-service-desk
npm install
```

## Running the App

You need **two terminals** running simultaneously:

**Terminal 1 — React app:**
```bash
npm run dev
```
Runs at `http://localhost:5173`

**Terminal 2 — JSON Server (mock backend):**
```bash
npm run server
```
Runs at `http://localhost:3001`

## Login Credentials (Demo Accounts)

| Role | Email | Password |
|---|---|---|
| Admin | admin@company.com | admin123 |
| Support Agent | agent@company.com | agent123 |
| Employee | employee@company.com | emp123 |

## API Endpoints (JSON Server)

| Resource | Endpoints |
|---|---|
| Users | `GET/POST /users`, `GET/PATCH/DELETE /users/:id` |
| Tickets | `GET/POST /tickets`, `GET/PATCH/DELETE /tickets/:id` |
| Comments | `GET/POST /comments`, `GET/PATCH/DELETE /comments/:id` |
| Categories | `GET/POST /categories`, `GET/PATCH/DELETE /categories/:id` |

> Note: `PATCH` is used for updates (not `PUT`) to avoid overwriting unrelated fields on partial updates.

## Role Permissions

See the in-app role matrix. Summary:

| Feature | Admin | Support Agent | Employee |
|---|---|---|---|
| View all tickets | ✅ | ❌ | ❌ |
| Create ticket | ✅ | ✅ | ✅ |
| Assign/Reassign | ✅ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ |
| Manage categories | ✅ | ❌ | ❌ |
| Resolve ticket | ✅ | Assigned only | ❌ |
| Edit ticket | ✅ | Assigned only | Own + Open only |

## Project Structure

src/
├── components/ # Reusable UI components by domain
├── pages/ # Route-level pages
├── services/ # Axios-based API functions per resource
├── types/ # TypeScript interfaces
├── hooks/ # useAuth, useToast, useTickets, useLookups, etc.
├── routes/ # Route guards (RequireAuth, RequireAdmin)
└── utils/ # Validation and display helpers


## Deployment

Live URL: `<add after deploying>`

## Known Limitations

- Passwords are stored in plaintext in `db.json` (acceptable for this mock/demo project; not production-safe)
- No email verification or password reset flow
- Activity timeline is derived client-side from ticket/comment data rather than a dedicated activity-log resource

