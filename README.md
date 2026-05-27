<div align="center">
<img src="https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/Deployed-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
🎬 WatchLater — Backend
Save links. Get reminded. Watch later.
REST API for the WatchLater mobile app — a personal watch list manager with push notifications, SMS password recovery and automatic thumbnail fetching.
📱 Mobile App · 📖 API Docs · 🐛 Report Bug
</div>

✨ Features

🔐 JWT Authentication — register, login, secure token-based sessions
🔗 Link saving — save any URL with auto-fetched title and thumbnail
📋 Status management — mark items as watched / pending
🗑️ Trash & Restore — soft delete with recovery option
🔔 Push Notifications — scheduled reminders via Expo SDK
📱 SMS OTP — password reset via TextBee SMS gateway
📞 Profile management — update phone number and email
📄 Swagger UI — full interactive API documentation
💓 Keepalive endpoint — prevents cold starts on free hosting


🛠 Tech Stack
LayerTechnologyFrameworkNestJS 11LanguageTypeScript 5.7DatabasePostgreSQL (Neon)ORMTypeORM 0.3AuthJWT (@nestjs/jwt)SMSTextBee APIPushExpo Server SDKScheduler@nestjs/scheduleValidationclass-validatorDocsSwagger (OpenAPI)HostingRender

📡 API Reference
🔑 Auth /auth
MethodEndpointAuthDescriptionPOST/auth/sign-up❌Register new userPOST/auth/sign-in❌Login and get JWT tokenPOST/auth/logout✅LogoutGET/auth/me✅Get current user profilePOST/auth/forgot-password❌Send OTP to phone numberPOST/auth/verify-otp❌Verify OTP codePOST/auth/reset-password❌Reset password with OTPGET/auth/ping❌Health check / keepalive
📦 Items /items
MethodEndpointDescriptionPOST/itemsSave new linkGET/itemsGet all itemsGET/items/:idGet single itemPATCH/items/:id/statusUpdate watch statusDELETE/items/:idMove to trashGET/items/trashGet trashed itemsPATCH/items/:id/restoreRestore from trashPATCH/items/notifications/toggleEnable / disable notificationsPATCH/items/push-tokenUpdate Expo push token
👤 User /user
MethodEndpointDescriptionPATCH/user/phoneUpdate phone numberPATCH/user/emailUpdate email address

Full interactive docs available at /api/docs


🚀 Getting Started
Prerequisites

Node.js 18+
pnpm
PostgreSQL database

Installation
bash# Clone the repository
git clone https://github.com/GormanProg123/WatchLaterApp-BackEnd.git
cd WatchLaterApp-BackEnd

# Install dependencies
pnpm install
Environment Variables
Create a .env file in the root directory:
env# Database
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# Server
PORT=3000

# TextBee SMS Gateway
TEXTBEE_API_KEY=your_textbee_api_key
TEXTBEE_DEVICE_ID=your_textbee_device_id
Running the App
bash# Development (watch mode)
pnpm start:dev

# Production build
pnpm build
pnpm start:prod
Database Migrations
bash# Generate a new migration
pnpm migration:generate

# Apply all pending migrations
pnpm migration:run

# Revert the last migration
pnpm migration:revert

📁 Project Structure
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

☁️ Deployment
The API is hosted on Render and connected to a Neon PostgreSQL database.
Render Environment Variables
Set these in your Render dashboard under Environment:
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
PORT
TEXTBEE_API_KEY
TEXTBEE_DEVICE_ID

⚠️ Free tier note: Render spins down the server after 15 minutes of inactivity. The mobile app sends a keepalive ping to GET /auth/ping every 14 minutes to prevent cold starts.


🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

Fork the repository
Create your feature branch: git checkout -b feature/amazing-feature
Commit your changes: git commit -m 'Add amazing feature'
Push to the branch: git push origin feature/amazing-feature
Open a Pull Request


📄 License
This project is open source and available under the MIT License.

<div align="center">
Made with ❤️ using NestJS
⭐ Star this repo if you find it useful!
</div>
