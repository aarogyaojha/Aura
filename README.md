# 🌟 Aura - Social Experience Reimagined

![Aura Logo](client/src/assets/aura_logo.png)

**Aura** is a premium, full-stack social networking platform designed for modern interaction. Built with a robust MERN stack architecture, Aura combines elegant design with advanced security features like context-based authentication and automated content moderation.

> [!IMPORTANT]
> This project was formerly known as `mySocialSpace`. It has been rebranded to **Aura** with a complete UI overhaul and modern component architecture.

---

## ✨ Features

- 🎨 **Premium Aesthetics**: Gorgeous warm-toned UI built with Tailwind CSS and Shadcn/UI.
- 🔐 **Context-Based Authentication**: Smart security that detects login patterns and protects your account.
- 🛡️ **Automated Moderation**: Integrated `classifier_server` for real-time content safety.
- 📱 **Fully Responsive**: Seamless experience across mobile, tablet, and desktop.
- 💬 **Real-time Engagement**: Instant updates for posts, comments, and community interactions.
- 👤 **Advanced Profiles**: Detailed user profiles with customizable avatars and activity tracking.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Redux Toolkit, Tailwind CSS, Shadcn/UI, Lucide Icons |
| **Backend** | Node.js, Express.js, Passport.js, JWT, MongoDB |
| **AI/Moderation**| Python, Flask/FastAPI (Classifier Server) |
| **Dev Tools** | Vite, PostCSS, ESLint |

---

## 📁 Project Structure

```bash
Aura/
├── client/             # React + Vite frontend (Aura Client)
│   ├── src/components  # UI components (Shared + Shadcn)
│   ├── src/pages       # Route-level components
│   └── src/redux       # State management
├── server/             # Node.js + Express backend (Aura Server)
│   ├── models/         # Database schemas
│   ├── controllers/    # Business logic
│   └── middlewares/    # Security & Validation
├── classifier_server/  # Python-based moderation engine
└── resources/          # Design assets & static files
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **MongoDB** (Local or Atlas)
- **Python** (v3.9+ for classifier server)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aarogyaojha/mySocialSpace.git
   cd mySocialSpace
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   # Create .env and add:
   # PORT=4000
   # MONGODB_URI=your_db_uri
   # JWT_SECRET=your_secret
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

4. **Setup Classifier** (Optional but recommended)
   ```bash
   cd ../classifier_server
   pip install -r requirements.txt
   ```

### Running the App

- **Server**: `npm start` (in `server/`)
- **Client**: `npm run dev` (in `client/`)
- **Classifier**: `python classifier_api.py` (in `classifier_server/`)

---

## 📄 Documentation

- [Frontend Documentation](client/README.md)
- [Backend Documentation](server/README.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [License](LICENSE)

---

## � Contributing

We welcome contributions! Please check our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

Developed with ❤️ by **Aarogya Ojha**
