# 🎨 Aura Client — Frontend Documentation

The Aura frontend is a premium, high-performance social media interface built with **React 18**, **Vite**, and **Redux Toolkit**. It focuses on a "Reddit-like" user experience with a modern, responsive design.

## 🏗️ Technical Architecture

- **Framwork**: React 18 (Functional Components + Hooks)
- **State Management**: Redux Toolkit (Slices & Thunks) for global post, comment, and auth states.
- **Real-time Engine**: Socket.io-client for live notifications and vote synchronization.
- **Styling**: Tailwind CSS with custom HSL theme variables for Dark/Light mode.
- **Components**: Atomic design approach using Radix UI primitives and Lucide icons.

## 📂 Project Organization

- `src/components/post`: Core post rendering logic, voting buttons, and markdown support.
- `src/components/profile`: Profile cards, karma displays, and update forms.
- `src/components/community`: Community feeds, sidebars, and join logic.
- `src/redux/slices`: Redux logic for decoupled state management.
- `src/assets`: Image assets including the Aura logo and brand colors.

## 🗳️ State Management Strategy

Aura uses a sophisticated Redux state to handle complex interactions:
1. **Optimistic UI**: Voting and saving actions update the Redux state immediately before the API response for an "instant" feel.
2. **Recursive Reducers**: The post reducer handles deeply nested threaded comments by normalizing child arrays.
3. **Persisted Theme**: UI theme (Dark/Light) is managed in a separate slice and synced with `localStorage`.

## 🌈 Design System: "Sleek & Premium"

Aura uses a custom design system defined in `tailwind.config.js`.

| Category | Token | Variable |
| :--- | :--- | :--- |
| **Colors** | Primary | `--primary` (Orange-Red) |
| **Typography** | Font | Inter / System Sans |
| **Radius** | Rounded | `12px` (Card), `50%` (Avatar) |

## 🚀 Development Workflow

### Scripts
- `npm run dev`: Start Vite development server.
- `npm run build`: Production bundle optimized for speed.
- `npm run lint`: ESLint check for code quality.

### Environment
Ensure `VITE_API_URL` is set in your client `.env` to point to the backend server.

---

Maintainer: **Aarogya Ojha**
