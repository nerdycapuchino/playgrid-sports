# Backend Server Architecture

## Directory Structure

```
apps/server/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── dtos/
│   │   │   └── middleware/
│   │   ├── wallet/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── dtos/
│   │   │   └── repositories/
│   │   ├── venue/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── dtos/
│   │   │   └── repositories/
│   │   ├── booking/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── dtos/
│   │   │   └── repositories/
│   │   ├── game/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── dtos/
│   │   │   └── repositories/
│   │   ├── elo/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   └── dtos/
│   │   ├── merchant/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── dtos/
│   │   │   └── repositories/
│   │   ├── admin/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   └── dtos/
│   │   └── common/
│   │       ├── middleware/
│   │       ├── guards/
│   │       ├── filters/
│   │       ├── pipes/
│   │       └── decorators/
│   ├── config/
│   ├── database/
│   ├── utils/
│   ├── app.module.ts
│   └── main.ts
├── prisma/
│   └── schema.prisma
├── package.json
├── .env.example
└── tsconfig.json
```

## Clean Architecture Pattern

Each module follows a 3-layer architecture:

### 1. Controller Layer
- Handles HTTP requests/responses
- Input validation (DTOs)
- Error handling

### 2. Service Layer
- Business logic implementation
- Database operations (via repositories)
- External service integration

### 3. Repository/Data Layer
- Prisma ORM integration
- Database queries
- Data persistence

## Core Services

### Wallet Module
- **WalletService**: Manage user wallet balances
- **TokenLedgerService**: Track all token transactions
- **TransactionService**: Handle wallet deposits/withdrawals

### Venue Module
- **VenueService**: Manage venue information
- **SlotService**: Handle slot management with Redis locking (15-min TTL)
- **PricingService**: Dynamic pricing engine using Redis

### Booking Module
- **BookingService**: Create and manage bookings
- **SplitPaymentService**: Handle split payment logic
- **PaymentDistributionService**: Atomic wallet deductions

### Game Module
- **GameService**: Manage pickup games
- **MatchService**: Track match results
- **GameRoomService**: Real-time room management via Firebase

### Elo Module
- **EloRatingService**: Calculate ratings using formula: E_A = 1/(1 + 10^((R_B - R_A)/400))
- **MatchResultService**: Process match outcomes (K-factor=32)
- **LeaderboardService**: Maintain rating leaderboards

### Merchant Module
- **InventoryService**: Manage venue inventory
- **DynamicPricingService**: Redis-based pricing engine
- **AnalyticsService**: Merchant dashboard analytics
- **GSTPricingService**: Calculate GST for B2B

### Admin Module
- **RBACService**: Role-based access control middleware
- **AuditLogService**: Immutable audit logging
- **UserManagementService**: Admin user operations

## Key Implementation Notes

1. **Token Economy**: No external payment gateways. All transactions use internal token system.
2. **Redis Caching**: Slot locks, pricing data, real-time updates
3. **Database Transactions**: Atomic operations for split payments
4. **Distributed Locking**: Redis locks for concurrent slot bookings
5. **Audit Logging**: All financial transactions logged immutably
