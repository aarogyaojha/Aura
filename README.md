# Aura

A full-stack anonymous social platform with AI-powered content moderation. Built on the MERN stack with a multi-service Docker Compose architecture — the ML classifier runs as its own independent service, not embedded in the main backend.

---

## Architecture

Three independently deployable services:

```
┌─────────────────┐     ┌─────────────────┐     ┌──────────────────────┐
│  React client   │────▶│  Express/Node   │────▶│  Python classifier   │
│  (Vite + Redux) │     │  + Socket.io    │     │  (Flask + sklearn)   │
└─────────────────┘     └────────┬────────┘     └──────────────────────┘
                                 │
                         ┌───────▼───────┐
                         │   MongoDB     │
                         └───────────────┘
```

**Why a separate classifier service?** Keeps ML dependencies (Python, scikit-learn, Perspective API) isolated from the Node.js runtime. The classifier can be retrained and redeployed independently without touching the backend. It's also how you'd run this in production — not as a subprocess.

**Context-aware auth** — login verification considers IP, location, and device metadata, not just credentials. Suspicious context (new device + new location) triggers additional verification.

**GitHub Actions CI/CD** — automated build and test pipeline on every push.

---

## Features

- Threaded discussions with infinite recursive comment nesting
- Upvote/downvote with hot, new, top, and rising feed sorting
- Real-time interactions via Socket.io
- AI content moderation — posts are screened by the Python classifier before going live
- Dark mode with system preference detection
- Full GitHub Flavored Markdown rendering in posts and comments
- Community flairs, NSFW/Pinned/Locked post indicators

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Redux Toolkit, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express, MongoDB (Mongoose), Socket.io, Passport.js |
| ML Moderation | Python, Flask, scikit-learn, Perspective API |
| Infrastructure | Docker Compose, GitHub Actions |

---

## Getting started

**One-command setup (Docker):**

```bash
git clone https://github.com/aarogyaojha/Aura.git
cd Aura
docker-compose up --build
```

This starts all three services — client, server, and classifier — plus MongoDB.

**Manual setup:**

```bash
# Clone
git clone https://github.com/aarogyaojha/Aura.git
cd Aura

# Configure environment
cp server/.env.example server/.env
cp client/.env.example client/.env

# Start services (each in its own terminal)
cd server && npm start
cd client && npm run dev
cd classifier_server && python classifier_api.py
```

---

## License

MIT © Aarogya Ojha
