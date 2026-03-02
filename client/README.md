# 🎨 Aura Frontend Documentation

The Aura frontend is a modern, high-performance web application built with **React**, **Vite**, and **Redux Toolkit**. It utilizes **Shadcn/UI** for its design system and **Tailwind CSS** for styling.

## 🏗️ Architecture

- **State Management**: Redux Toolkit for global state (Auth, Posts, Admin).
- **Styling**: Tailwind CSS with a custom design system defined in `tailwind.config.js` and `index.css`.
- **Components**: 
  - `src/components/ui/`: Atomic Shadcn/UI components.
  - `src/components/shared/`: Layout components like Navbar, Footer, and Search.
  - `src/components/[feature]/`: Feature-specific components (Post, Profile, Community).
- **Routing**: `react-router-dom` for client-side navigation.

## 🌈 Design System

Aura uses a warm and premium color palette.

| Token | Color | Hex |
| :--- | :--- | :--- |
| Background | Cream | `#FFFBF1` |
| Primary | Rose Red| `#E36A6A` |
| Secondary | Soft Pink| `#FFB2B2` |
| Accent | Beige | `#FFF2D0` |

### Using Components

Most UI elements are built using Shadcn/UI. Example usage:

```jsx
import { Button } from "@/components/ui/button";

export const MyComponent = () => (
  <Button variant="default">Click Me</Button>
);
```

## 🚀 Development

### Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Compiles the application for production.
- `npm run preview`: Locally previews the production build.

### Environment Variables

Ensure the `proxy` field in `package.json` or `vite.config.js` points to your backend server (default: `http://127.0.0.1:4000`).

## 📁 Key Directories

- `src/assets/`: Images, logos, and global static files.
- `src/hooks/`: Custom React hooks for shared logic.
- `src/pages/`: Main page components mapping to routes.
- `src/redux/`: Redux slices, actions, and store configuration.
- `src/utils/`: Formatting, constants, and helper functions.

---

Maintainer: **Aarogya Ojha**
