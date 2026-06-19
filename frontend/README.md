### Project Structure

```text
─ frontend
│  ├─ .dockerignore
│  ├─ .env
│  ├─ .env.example
│  ├─ .env.production
│  ├─ .prettierrc
│  ├─ components.json
│  ├─ Dockerfile
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ Fab_logo.png
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ Fab_logo.png
│  │  │  ├─ hero.png
│  │  │  ├─ react.svg
│  │  │  └─ vite.svg
│  │  ├─ components
│  │  │  ├─ auth
│  │  │  │  ├─ ProtectedRoute.tsx
│  │  │  │  ├─ SignInForm.tsx
│  │  │  │  └─ SignUpForm.tsx
│  │  │  ├─ common
│  │  │  │  └─ AppPagination.tsx
│  │  │  ├─ games
│  │  │  │  ├─ GameCard.tsx
│  │  │  │  ├─ GameDetailPanel.tsx
│  │  │  │  ├─ GameFeaturedDrop.tsx
│  │  │  │  ├─ GameFilter.tsx
│  │  │  │  ├─ GameTag.tsx
│  │  │  │  ├─ NotGame.tsx
│  │  │  │  ├─ Stars.tsx
│  │  │  │  └─ SubmitGameForm.tsx
│  │  │  ├─ layouts
│  │  │  │  ├─ Header.tsx
│  │  │  │  ├─ Logo.tsx
│  │  │  │  ├─ MainLayout.tsx
│  │  │  │  ├─ MainLayoutRoute.tsx
│  │  │  │  └─ UserAvatar.tsx
│  │  │  ├─ profile
│  │  │  │  └─ AvatarUpload.tsx
│  │  │  ├─ skeletons
│  │  │  │  ├─ GameCardSkeleton.tsx
│  │  │  │  ├─ GameFeaturedDropSkeleton.tsx
│  │  │  │  ├─ GamePageSkeleton.tsx
│  │  │  │  ├─ GameTagSkeleton.tsx
│  │  │  │  ├─ HomeSkeleton.tsx
│  │  │  │  ├─ ProfileSkeleton.tsx
│  │  │  │  ├─ SubmitGameFormSkeleton.tsx
│  │  │  │  └─ SubmitGamePageSkeleton.tsx
│  │  │  └─ ui
│  │  │     ├─ avatar.tsx
│  │  │     ├─ button.tsx
│  │  │     ├─ dialog.tsx
│  │  │     ├─ pagination.tsx
│  │  │     ├─ skeleton.tsx
│  │  │     └─ sonner.tsx
│  │  ├─ context
│  │  │  ├─ AuthContext.tsx
│  │  │  └─ GameContext.tsx
│  │  ├─ hooks
│  │  │  ├─ useAuth.ts
│  │  │  ├─ useGame.ts
│  │  │  └─ useUser.ts
│  │  ├─ index.css
│  │  ├─ lib
│  │  │  ├─ api.ts
│  │  │  ├─ schemas
│  │  │  │  └─ gameSchema.ts
│  │  │  └─ utils.ts
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ GameDetail.tsx
│  │  │  ├─ Games.tsx
│  │  │  ├─ Home.tsx
│  │  │  ├─ Play.tsx
│  │  │  ├─ Profile.tsx
│  │  │  ├─ SignIn.tsx
│  │  │  ├─ SignUp.tsx
│  │  │  └─ SubmitGame.tsx
│  │  ├─ services
│  │  │  ├─ authService.ts
│  │  │  ├─ gameService.ts
│  │  │  └─ userService.ts
│  │  └─ types
│  │     ├─ Auth.ts
│  │     ├─ BaseResponse.ts
│  │     ├─ Game.ts
│  │     └─ User.ts
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
```
