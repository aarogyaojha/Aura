# ⚙️ Aura Server — Backend API Documentation

The Aura backend is a high-performance RESTful API built with **Node.js**, **Express**, and **MongoDB**. It serves as the central orchestration layer for authentication, content persistence, and real-time synchronization.

## 🏗️ Technical Architecture

- **Engine**: Node.js with Express framework.
- **Database**: MongoDB (Mongoose ODM) with optimized indexing for feed generation.
- **API Versioning**: All core endpoints are prefixed with `/api/v1` for scalability.
- **Real-time**: Socket.io integration for instant notification delivery.
- **Security**: Multi-layered protection including JWT, CORS restriction, and NoSQL injection prevention.

## 🛡️ Security & Performance Features

1. **Context-Aware Auth**: Login sessions are verified against IP and device metadata to detect suspicious activity.
2. **AI Content Safety**: Integrated with `classifier_server` and Google Perspective API for automated toxicity detection.
3. **Advanced Rate Limiting**: Protection against brute-force and DDoS patterns on sensitive endpoints.
4. **Payload Optimization**: Gzip compression and efficient Mongoose lean queries for minimal latency.

## 📂 Project Organization

- `models/`: Schema definitions for Users, Posts, Communities, Comments, and ModLogs.
- `controllers/`: Decoupled logic handlers for API requests.
- `middlewares/`: Security (helmet, sanitize), Auth (JWT), and Global Error Handling.
- `services/`: Abstracted integrations for AWS S3, Cloudinary, and Email (Nodemailer).
- `routes/`: Versioned route definitions for clean endpoint mapping.

## 📡 Core API Endpoints (v1)

### Authentication
- `POST /api/v1/auth/login`: Context-aware login.
- `POST /api/v1/auth/register`: User onboard with email verification.

### Content
- `GET /api/v1/posts`: paginated feed with sort (`hot`, `new`, `top`, `rising`).
- `POST /api/v1/posts/:id/vote`: Atomic upvote/downvote operations.
- `POST /api/v1/comments/:id/reply`: Threaded comment interaction.

### Moderation
- `PATCH /api/v1/posts/:id/lock`: Moderator-only thread locking.
- `POST /api/v1/reports`: Content reporting for manual review.

## 🚀 Deployment & Scripts

- `npm start`: Development mode with `nodemon`.
- `npm run production`: Optimized production execution.
- `npm run test`: Jest-based integration tests (where applicable).

---

Maintainer: **Aarogya Ojha**
