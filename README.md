<div align="center">

<img src="https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/Deployed-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />

# 🎬 WatchLater — Backend

**Save links. Get reminded. Watch later.**

REST API for the WatchLater mobile app — a personal watch list manager with push notifications, SMS password recovery and automatic thumbnail fetching.

[📱 Mobile App](https://github.com/GormanProg123/WatchLaterApp) · [📖 API Docs](https://watchlaterapp-backend.onrender.com/api/docs) · [🐛 Report Bug](https://github.com/GormanProg123/WatchLaterApp-BackEnd/issues)

</div>

---

## ✨ Features

- 🔐 **JWT Authentication** — register, login, secure token-based sessions
- 🔗 **Link saving** — save any URL with auto-fetched title and thumbnail
- 📋 **Status management** — mark items as watched / pending
- 🗑️ **Trash & Restore** — soft delete with recovery option
- 🔔 **Push Notifications** — scheduled reminders via Expo SDK
- 📱 **SMS OTP** — password reset via TextBee SMS gateway
- 📞 **Profile management** — update phone number and email
- 📄 **Swagger UI** — full interactive API documentation
- 💓 **Keepalive endpoint** — prevents cold starts on free hosting

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | NestJS 11 |
| Language | TypeScript 5.7 |
| Database | PostgreSQL (Neon) |
| ORM | TypeORM 0.3 |
| Auth | JWT (@nestjs/jwt) |
| SMS | TextBee API |
| Push | Expo Server SDK |
| Scheduler | @nestjs/schedule |
| Validation | class-validator |
| Docs | Swagger (OpenAPI) |
| Hosting | Render |

---

## 📡 API Reference

### 🔑 Auth `/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/sign-up` | ❌ | Register new user |
| `POST` | `/auth/sign-in` | ❌ | Login and get JWT token |
| `POST` | `/auth/logout` | ✅ | Logout |
| `GET` | `/auth/me` | ✅ | Get current user profile |
| `POST` | `/auth/forgot-password` | ❌ | Send OTP to phone number |
| `POST` | `/auth/verify-otp` | ❌ | Verify OTP code |
| `POST` | `/auth/reset-password` | ❌ | Reset password with OTP |
| `GET` | `/auth/ping` | ❌ | Health check / keepalive |

### 📦 Items `/items`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/items` | Save new link |
| `GET` | `/items` | Get all items |
| `GET` | `/items/:id` | Get single item |
| `PATCH` | `/items/:id/status` | Update watch status |
| `DELETE` | `/items/:id` | Move to trash |
| `GET` | `/items/trash` | Get trashed items |
| `PATCH` | `/items/:id/restore` | Restore from trash |
| `PATCH` | `/items/notifications/toggle` | Enable / disable notifications |
| `PATCH` | `/items/push-token` | Update Expo push token |

### 👤 User `/user`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PATCH` | `/user/phone` | Update phone number |
| `PATCH` | `/user/email` | Update email address |

> Full interactive docs available at [`/api/docs`](https://watchlaterapp-backend.onrender.com/api/docs)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **pnpm**
- **PostgreSQL** database

### Installation

```bash
# Clone the repository
git clone https://github.com/GormanProg123/WatchLaterApp-BackEnd.git
cd WatchLaterApp-BackEnd

# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Server
PORT=3000

# TextBee SMS Gateway
TEXTBEE_API_KEY=your_textbee_api_key
TEXTBEE_DEVICE_ID=your_textbee_device_id
```

### Running the App

```bash
# Development (watch mode)
pnpm start:dev

# Production build
pnpm build
pnpm start:prod
```

### Database Migrations

```bash
# Generate a new migration
pnpm migration:generate

# Apply all pending migrations
pnpm migration:run

# Revert the last migration
pnpm migration:revert
```

---

## 📁 Project Structure

```
src/
├── applications/
│   └── usecases/               # Business logic layer
│       ├── auth.usecases.ts    # Auth: sign-up, sign-in, OTP, reset
│       ├── items.usecases.ts   # Items: CRUD, trash, notifications
│       └── user.usecases.ts    # User: phone & email update
│
├── domain/
│   └── dto/                    # Request validation schemas
│
├── infrastructure/
│   ├── database/
│   │   ├── migrations/         # TypeORM migrations
│   │   └── schemas/            # Entities: User, Item, Tag, Reminder, PasswordReset
│   └── services/
│       ├── TextBee.service.ts       # SMS OTP sending
│       ├── notification.service.ts  # Expo push notifications
│       └── thumbnail.service.ts     # URL thumbnail fetching
│
├── presentation/
│   ├── controllers/            # HTTP route handlers
│   └── modules/                # NestJS dependency injection modules
│
└── shared/
    └── utils/                  # generateToken, excludePassword
```

---

## ☁️ Deployment

The API is hosted on **[Render](https://render.com)** and connected to a **[Neon](https://neon.tech)** PostgreSQL database.

### Render Environment Variables

Set these in your Render dashboard under **Environment**:

```
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
PORT
TEXTBEE_API_KEY
TEXTBEE_DEVICE_ID
```

> **⚠️ Free tier note:** Render spins down the server after 15 minutes of inactivity. The mobile app sends a keepalive ping to `GET /auth/ping` every 14 minutes to prevent cold starts.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the **MIT License**.

---

<div align="center">

Made with ❤️ using NestJS

⭐ Star this repo if you find it useful!

</div>
