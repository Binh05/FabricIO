# FabricIO Frontend

Web client for the [FabricIO](../README.md) gaming platform, built with **React**, **TypeScript** and **Vite**. It talks to the Spring Boot [backend](../backend/README.md) over a REST API with JWT authentication.

**Live demo:** https://fabricio.id.vn

---

## Tech Stack

| Area | Technologies |
| :--- | :----------- |
| Framework | React, TypeScript |
| Build tool | Vite |
| Package manager | pnpm |
| Styling | Tailwind CSS, shadcn/ui |
| HTTP client | Axios |
| State management | React Context API |
| Notifications | Sonner (toasts) |
| Code quality | ESLint, Prettier |
| Hosting | Cloudflare Pages |

---

## Architecture

The frontend separates **API access**, **state** and **logic** into three layers, so components stay small and easy to test.

| Layer | Folder | Responsibility |
| :---- | :----- | :------------- |
| Services | `src/services/` | Functions that call the API and return the plain response. No state, no UI logic. |
| Context | `src/context/` | Global state (`AuthContext`, `GameContext`). |
| Hooks | `src/hooks/` | Connect services with context to form complete, ready-to-use logic handlers (`useAuth`, `useGame`, `useUser`). |
| Components / pages | `src/components/`, `src/pages/` | UI. They use hooks only and never call services directly. |

Data flow:

```text
Page / Component
      │  calls
      ▼
Hook (useAuth, useGame, useUser)      ← complete logic: call service, handle result,
      │                                  update context, show feedback
      ├──► Service (authService, gameService, userService)
      │          │  Axios instance (lib/api.ts)
      │          ▼
      │      Backend REST API
      │
      └──► Context (AuthContext, GameContext)  ← global state shared across the app
```

Example, signing in:

1. `SignInForm` calls `useAuth().signIn(credentials)`.
2. The hook calls `authService.signIn(credentials)`, which only sends the request and returns the response.
3. The hook stores the user and token in `AuthContext` and handles errors and feedback.
4. `ProtectedRoute` reads the auth state to allow or block access to private pages.

---

## Project Structure

```text
frontend/
├─ public/                     # Static files (logo, favicon, icons)
├─ src/
│  ├─ App.tsx                  # Routes and app composition
│  ├─ main.tsx                 # Entry point
│  ├─ index.css                # Global styles (Tailwind)
│  ├─ assets/                  # Images bundled with the app
│  ├─ components/
│  │  ├─ auth/                 # ProtectedRoute, SignInForm, SignUpForm
│  │  ├─ common/               # Shared components (AppPagination)
│  │  ├─ games/                # GameCard, GameDetailPanel, GameFeaturedDrop, GameFilter,
│  │  │                        # GameTag, NotGame, Stars, SubmitGameForm
│  │  ├─ layouts/              # Header, Logo, MainLayout, MainLayoutRoute, UserAvatar
│  │  ├─ profile/              # AvatarUpload
│  │  ├─ skeletons/            # Loading placeholders for pages and cards
│  │  └─ ui/                   # shadcn/ui primitives (avatar, button, dialog,
│  │                           # pagination, skeleton, sonner)
│  ├─ context/                 # AuthContext, GameContext
│  ├─ hooks/                   # useAuth, useGame, useUser
│  ├─ lib/
│  │  ├─ api.ts                # Axios instance and interceptors
│  │  ├─ schemas/              # Form validation schemas (gameSchema)
│  │  └─ utils.ts              # Helpers
│  ├─ pages/                   # Home, Games, GameDetail, Play, Profile,
│  │                           # SignIn, SignUp, SubmitGame
│  ├─ services/                # authService, gameService, userService
│  └─ types/                   # Auth, BaseResponse, Game, User
├─ .env.example                # Environment variable template
├─ .env.production             # Production build configuration
├─ .prettierrc                 # Prettier rules
├─ components.json             # shadcn/ui configuration
├─ eslint.config.js            # ESLint configuration
├─ index.html
├─ vite.config.ts
├─ tsconfig.json               # TypeScript configs (app, node)
├─ package.json
├─ pnpm-lock.yaml              # Lockfile (pnpm)
└─ Dockerfile                  # Image used by the local Docker Compose setup
```

---

## Pages

| Page | Description |
| :--- | :---------- |
| `Home` | Landing page with featured games |
| `Games` | Game catalog with filters, tags and pagination |
| `GameDetail` | Details of a single game |
| `Play` | Play a game |
| `SubmitGame` | Publish a new game (protected) |
| `Profile` | Account page with avatar upload (protected) |
| `SignIn` / `SignUp` | Authentication |

Pages that load data use skeleton components (`components/skeletons`) while requests are in flight.

---

## Getting Started

### Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) (install with `corepack enable` or `npm install -g pnpm`)
- A running backend (see the [backend README](../backend/README.md))

### Setup

```bash
cp .env.example .env
pnpm install
```

Edit `.env` so the API base URL points to your backend, for example `http://localhost:8080` when running locally. Variables exposed to the browser must start with `VITE_`. Never put secrets in frontend environment files.

### Run in development

```bash
pnpm dev
```

The app starts at http://localhost:5173 with hot module replacement.

### Scripts

| Command | Description |
| :------ | :---------- |
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Type-check and build for production (output in `dist/`) |
| `pnpm preview` | Preview the production build locally |
| `pnpm lint` | Run ESLint (also runs in CI on every push) |

### Run with Docker

The frontend has its own `Dockerfile`, used by the full local stack. See the [root README](../README.md) for the Docker Compose command.

---

## Code Style

- **Lint:** `pnpm lint` must pass before you open a pull request.
- **Format:** Prettier, configured in `.prettierrc`.
- **Types:** API response types live in `src/types`. `BaseResponse` mirrors the backend's standard response wrapper, and all services return typed data.
- **Forms:** validation schemas live in `src/lib/schemas`.
- **UI:** use the shadcn/ui primitives in `components/ui` and Tailwind utility classes. Add new primitives with the shadcn CLI (configured by `components.json`).

### Conventions

1. **Services stay thin.** A service function calls the API and returns the plain response. It does not touch state, show toasts or navigate.
2. **Logic lives in hooks.** Put request handling, state updates and user feedback in a hook that combines a service with a context.
3. **Components don't call services.** They consume hooks.
4. **One source of global state.** Shared state belongs in a context, local UI state stays in the component.
5. **Type everything.** Add or update types in `src/types` when the API changes.

---

## Deployment

The frontend is deployed on **Cloudflare Pages**.

| Setting | Value |
| :------ | :---- |
| Build command | `pnpm build` |
| Output directory | `dist` |
| Environment | Variables from `.env.production` (set the API URL to the production backend) |

Pages builds the app from the repository on push. The backend runs separately on Render.

---

## Troubleshooting

- **API requests fail or return CORS errors:** check the API base URL in `.env` and make sure the backend allows your frontend origin.
- **First request is slow in production:** the backend on Render may be waking up from idle.
- **Wrong package manager:** this project uses pnpm. Do not commit `package-lock.json` or `yarn.lock`.