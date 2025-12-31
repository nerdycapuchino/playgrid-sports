# PlayGrid 🏏

**Unified Sports Infrastructure Platform** for venue discovery, slot booking with split payments, and pickup game management.

## 🎯 Project Overview

PlayGrid is an MVP-focused sports infrastructure platform designed to revolutionize how sports enthusiasts discover venues, book slots, and manage pickup games. Initially targeting **Cricket in India**, the platform leverages modern technologies to provide seamless user experiences across mobile and web.

### Phase 1 MVP Objectives
- ✅ Venue discovery with location-based filtering
- ✅ Slot booking with dynamic pricing
- ✅ Split payment support for group bookings
- ✅ Pickup game creation and management
- ✅ Sport-specific user roles (Batsman, Bowler, etc.)
- ✅ Real-time slot availability
- ✅ OTP-based authentication

---

## 🏗️ Architecture

### Monorepo Structure
```
playgrid-sports/
├── apps/
│   ├── web/                 # React.js web application
│   │   ├── src/
│   │   │   ├── pages/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── hooks/
│   │   ├── public/
│   │   └── package.json
│   │
│   ├── mobile/              # React Native mobile application
│   │   ├── src/
│   │   │   ├── screens/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── navigation/
│   │   └── package.json
│   │
│   └── server/              # Node.js + Express backend
│       ├── src/
│       │   ├── modules/       # Feature modules (venues, bookings, games)
│       │   │   ├── venues/
│       │   │   ├── bookings/
│       │   │   ├── games/
│       │   │   ├── users/
│       │   │   └── payments/
│       │   ├── common/        # Shared utilities
│       │   │   ├── middlewares/
│       │   │   ├── validators/
│       │   │   ├── decorators/
│       │   │   └── utils/
│       │   ├── config/        # Configuration
│       │   ├── database/      # Database setup (Prisma)
│       │   ├── services/      # External services
│       │   └── app.ts
│       ├── prisma/
│       │   └── schema.prisma
│       └── package.json
│
├── docker-compose.yml       # Local dev environment
├── .github/
│   └── workflows/           # CI/CD pipelines
├── README.md
├── package.json             # Root monorepo config
└── .gitignore
```

---

## 🛠️ Tech Stack

### Frontend
- **Web**: React.js 18+, TypeScript, Tailwind CSS
- **Mobile**: React Native, TypeScript, NativeWind
- **State Management**: Redux Toolkit / Zustand
- **APIs**: Axios for HTTP requests

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database ORM**: Prisma
- **Validation**: Zod / Joi
- **Authentication**: Firebase (OTP)
- **Search**: Elasticsearch
- **Real-time**: Firebase Realtime DB / Socket.io

### Databases & Cache
- **Primary DB**: PostgreSQL 14+
- **Cache Layer**: Redis 6+
- **Search Index**: Elasticsearch 8+

### External Services
- **Payments**: Razorpay (UPI, Cards, Wallets)
- **Maps**: Google Maps API
- **Auth**: Firebase Authentication
- **Chat**: Firebase Realtime Database

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 6+

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/nerdycapuchino/playgrid-sports.git
   cd playgrid-sports
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or yarn install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Start local development environment**
   ```bash
   docker-compose up -d
   ```

5. **Setup database**
   ```bash
   cd apps/server
   npx prisma migrate dev
   npx prisma db seed  # Load sample data
   ```

6. **Start development servers**
   ```bash
   npm run dev
   # Web: http://localhost:3000
   # Server: http://localhost:5000
   ```

---

## 📱 Core Features

### 1. Venue Discovery
- Location-based search with Elasticsearch
- Venue details, pricing, and availability
- Ratings and reviews
- Facility information (parking, restrooms, lighting)

### 2. Slot Booking
- Real-time slot availability via Redis
- Dynamic pricing based on demand/time
- Multiple date/time slot selection
- Instant booking confirmation

### 3. Split Payments
- Group booking links for split payments
- Razorpay UPI/wallet integration
- Payment status tracking
- Invoice generation

### 4. Pickup Games
- Open games (public) vs. Private games (invite-only)
- Game creation with sport-specific details
- Player roster management
- Live score tracking (future phase)

### 5. User Profiles
- Sport-specific roles (Batsman, Bowler, Wicket-keeper, etc.)
- Rating and skill level
- Booking history
- Game statistics

---

## 🔌 API Endpoints (Phase 1)

### Venues
```
GET    /api/v1/venues/search          - Search venues by location/filters
GET    /api/v1/venues/:id             - Get venue details
GET    /api/v1/venues/:id/slots       - Get available slots
POST   /api/v1/venues/:id/ratings     - Add venue review
```

### Bookings
```
POST   /api/v1/bookings               - Create new booking
GET    /api/v1/bookings/:id           - Get booking details
PUT    /api/v1/bookings/:id/cancel    - Cancel booking
GET    /api/v1/bookings/user/:uid     - Get user bookings
POST   /api/v1/bookings/:id/payment   - Process payment
```

### Pickup Games
```
POST   /api/v1/games/pickup           - Create pickup game
GET    /api/v1/games/pickup/:id       - Get game details
POST   /api/v1/games/pickup/:id/join  - Join game
DELETE /api/v1/games/pickup/:id/leave - Leave game
GET    /api/v1/games/nearby           - Find games near location
```

### Users
```
POST   /api/v1/users/auth/otp         - Request OTP
POST   /api/v1/users/auth/verify      - Verify OTP
GET    /api/v1/users/profile          - Get user profile
PUT    /api/v1/users/profile          - Update profile
```

---

## 🗄️ Database Schema

The database schema is defined using Prisma. Key models include:

- **User**: Profile, roles, authentication
- **Venue**: Location, pricing, facilities
- **Slot**: Availability, pricing, occupancy
- **Booking**: User bookings, payments, status
- **PickupGame**: Open/private games, participants
- **Payment**: Transaction records, split tracking

See `apps/server/prisma/schema.prisma` for full schema.

---

## 🚀 Deployment

### Development
```bash
npm run dev              # Start all services
npm run dev:web        # Web only
npm run dev:mobile     # Mobile only
npm run dev:server     # Backend only
```

### Production
- **Backend**: Docker container on AWS ECS / Google Cloud Run
- **Frontend**: Vercel / Netlify CDN
- **Mobile**: Apple App Store / Google Play Store
- **Database**: AWS RDS PostgreSQL
- **Cache**: AWS ElastiCache Redis
- **Search**: Elasticsearch on AWS OpenSearch

---

## 📊 Performance & Scaling

- **Caching**: Redis for slot availability (TTL: 5 mins)
- **Database Indexing**: Optimized queries for location search
- **CDN**: Static assets via CloudFront
- **Rate Limiting**: API rate limits to prevent abuse
- **Load Balancing**: Horizontal scaling with Docker Compose / Kubernetes

---

## 🔐 Security

- **Authentication**: Firebase OTP + JWT tokens
- **Authorization**: Role-based access control (RBAC)
- **Data Encryption**: TLS/SSL in transit, encrypted at rest
- **PCI Compliance**: Razorpay handles payment security
- **Input Validation**: Zod/Joi schemas
- **Environment Variables**: Secure config management

---

## 📝 Contributing

We welcome contributions! Please follow these steps:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

Please ensure:
- Code follows our TypeScript/ESLint standards
- All tests pass (`npm test`)
- Changes are documented

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 🤝 Support & Contact

For questions, issues, or feature requests:
- Open an issue on GitHub
- Email: [contact@playgrid.dev]
- Twitter: [@playgrid_sports]

---

## 🎉 Roadmap

### Phase 1 (Current MVP)
- ✅ Core venue discovery
- ✅ Slot booking system
- ✅ Basic user profiles
- ✅ Pickup game management

### Phase 2
- Multi-sport support (Football, Basketball, Badminton, etc.)
- Advanced rating system
- Tournament management
- In-app messaging

### Phase 3
- Live score tracking
- Analytics & insights
- Coach/trainer profiles
- Equipment rental

---

**Built with ❤️ by PlayGrid Team**
