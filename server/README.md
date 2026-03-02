# ⚙️ Aura Backend Documentation

The Aura backend is a robust RESTful API built with **Node.js**, **Express**, and **MongoDB**. It handles authentication, data persistence, and coordinates with the content moderation engine.

## 🏗️ Architecture

- **Server Engine**: Node.js & Express.
- **Database**: MongoDB with Mongoose ODM.
- **Authentication**: Passport.js with JWT Strategy.
- **Security**: Context-aware login verification and rate limiting.

## 📂 Project Structure

- `app.js`: Entry point and middleware configuration.
- `models/`: Mongoose schemas for Users, Posts, Communities, etc.
- `controllers/`: Request handlers and business logic.
- `routes/`: API endpoint definitions.
- `middlewares/`: Custom logic for Auth, Validation, and logging.
- `services/`: Abstracted logic for 3rd party integrations (Email, Storage).
- `utils/`: Reusable helpers and email templates.

## 🔑 Environment Variables

Required variables in `.env`:

```env
PORT=4000
MONGODB_URI=mongodb://...
JWT_SECRET=your_jwt_signing_key
SMTP_HOST=...
SMTP_USER=...
SMTP_PASS=...
```

## 🚀 Development

### Scripts

- `npm start`: Runs the server using `nodemon`.
- `npm run production`: Runs the server using standard `node`.

## 🛡️ Security Features

1. **Context-Based Auth**: Captures IP, Device, and Location metadata during login.
2. **Device Blocking**: Allows users to block specific suspicious devices.
3. **Content Moderation**: Routes new posts through the `classifier_server` for safety checks.
4. **Password Hashing**: Uses `bcrypt` for secure credential storage.

## 📡 API Endpoints (Core)

- `/auth`: Context-based authentication and verification.
- `/users`: Profile management and follower logic.
- `/posts`: CRUD operations for posts and feed generation.
- `/communities`: Group management and permissions.
- `/admin`: Management dashboard logic.

---

Maintainer: **Aarogya Ojha**
