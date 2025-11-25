# Agency Dashboard

A modern, full-stack web application for managing agencies and contacts with a premium upgrade system. Built with Next.js 16, TypeScript, Prisma, and Clerk authentication.

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Components Overview](#components-overview)
- [Deployment](#deployment)

## 🎯 Overview

The Agency Dashboard is a comprehensive platform for managing agency relationships and contact information. It features:

- **User Authentication**: Secure authentication via Clerk
- **Agency Management**: View and manage agency information
- **Contact Management**: Browse and reveal contact details with daily limits
- **Usage Tracking**: Monitor daily contact view limits (50 views/day for free users)
- **Premium Upgrade**: Upgrade system for unlimited access
- **Real-time Updates**: Live data updates with server actions

## 🏗️ System Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Dashboard  │  │   Agencies   │  │   Contacts   │         │
│  │    Page      │  │    Page      │  │    Page      │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                  │                  │                  │
│         └──────────────────┼──────────────────┘                  │
│                            │                                     │
│                   ┌────────▼────────┐                            │
│                   │  Shared Layout  │                            │
│                   │  (Sidebar/Nav)  │                            │
│                   └────────┬────────┘                            │
│                            │                                     │
│  ┌─────────────────────────▼─────────────────────────┐         │
│  │              Client Components                      │         │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐          │         │
│  │  │Contacts  │ │Agencies  │ │Usage     │          │         │
│  │  │Client    │ │Client    │ │Counter   │          │         │
│  │  └──────────┘ └──────────┘ └──────────┘          │         │
│  └───────────────────────────────────────────────────┘         │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             │ Server Actions
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                      SERVER LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────┐         │
│  │           Server Actions (lib/actions.ts)         │         │
│  │  ┌──────────────┐  ┌──────────────┐             │         │
│  │  │ getAgencies  │  │ getContacts  │             │         │
│  │  │ getAllAgencies│ │revealContact │             │         │
│  │  │ getUserUsage │  │  Details     │             │         │
│  │  └──────┬───────┘  └──────┬───────┘             │         │
│  └─────────┼──────────────────┼─────────────────────┘         │
│            │                  │                                 │
│  ┌─────────▼──────────────────▼─────────┐                     │
│  │      Prisma ORM (lib/db.ts)          │                     │
│  └──────────────┬───────────────────────┘                     │
│                 │                                               │
└─────────────────┼───────────────────────────────────────────────┘
                  │
                  │ Database Queries
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│                    DATABASE LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Agency     │  │   Contact    │  │  UserLimit   │         │
│  │   Table      │  │   Table      │  │   Table      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│  ┌──────────────┐                                              │
│  │ContactReveal │                                              │
│  │   Table      │                                              │
│  └──────────────┘                                              │
│                                                                 │
│              PostgreSQL Database (Supabase)                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐                                              │
│  │    Clerk     │  - User Authentication & Management          │
│  │  (Auth)      │                                              │
│  └──────────────┘                                              │
│                                                                 │
│  ┌──────────────┐                                              │
│  │  Supabase    │  - PostgreSQL Database Hosting              │
│  │  (Database)  │                                              │
│  └──────────────┘                                              │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Request** → Client Component
2. **Server Action** → `lib/actions.ts` (Server-side logic)
3. **Prisma ORM** → Database queries
4. **PostgreSQL** → Data storage
5. **Response** → Back to client via Server Actions

### Authentication Flow

```
User → Clerk Auth → Middleware → Protected Routes → Dashboard
```

## ✨ Features

### Core Features

- **Dashboard Overview**
  - Statistics cards (Total Agencies, Contacts, Active Searches)
  - Daily contact views counter with progress bar
  - Recent agencies and contacts list
  - Daily contact views chart

- **Agency Management**
  - Browse all agencies with pagination
  - View agency details (name, state, type, website)
  - See contact count per agency
  - Filter and search capabilities

- **Contact Management**
  - Browse contacts with pagination
  - Search by name or email
  - Filter by agency
  - Reveal contact details (email, phone) with daily limit
  - View revealed contacts history

- **Usage Tracking**
  - Daily limit: 50 contact views per day (free users)
  - Real-time counter updates
  - Automatic daily reset
  - Visual progress indicator

- **Premium Upgrade System**
  - Upgrade dialog when limit is reached
  - List of premium advantages
  - Pricing information
  - Upgrade call-to-action

### Security Features

- Clerk authentication for secure user management
- Server-side data validation
- Protected routes via middleware
- Contact information masking (revealed only after limit check)
- User-specific data isolation

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Backend
- **Next.js Server Actions** - Server-side API logic
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Relational database (via Supabase)

### Authentication & Services
- **Clerk** - Authentication and user management
- **Supabase** - Database hosting

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type checking
- **Prisma Studio** - Database GUI

## 📁 Project Structure

```
agency-dashboardn/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── agencies/
│   │   │   ├── AgenciesClient.tsx
│   │   │   └── page.tsx
│   │   ├── contacts/
│   │   │   ├── ContactsClient.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx            # Dashboard layout
│   │   └── page.tsx               # Dashboard home
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── ContactsTable.tsx         # Contact row component
│   ├── Navigation.tsx            # Navigation menu
│   ├── Sidebar.tsx               # Sidebar component
│   ├── UpgradeDialog.tsx        # Premium upgrade modal
│   └── UsageCounter.tsx          # Usage counter display
│
├── lib/                          # Utility functions
│   ├── actions.ts                # Server actions
│   ├── db.ts                     # Prisma client
│   └── utils.ts                  # Helper functions
│
├── prisma/                       # Database schema & migrations
│   ├── data/                     # Seed data (CSV files)
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Database seeding script
│
├── public/                       # Static assets
├── middleware.ts                 # Next.js middleware (auth)
└── package.json                  # Dependencies
```

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────┐
│   Agency     │         │   Contact    │
├──────────────┤         ├──────────────┤
│ id (PK)      │◄──┐     │ id (PK)      │
│ originalId   │   │     │ originalId  │
│ name         │   │     │ firstName   │
│ state        │   │     │ lastName    │
│ type         │   │     │ email       │
│ website      │   │     │ phone       │
│ createdAt    │   │     │ title       │
└──────────────┘   │     │ agencyId(FK)├──┘
                   │     │ createdAt   │
                   │     └──────────────┘
                   │              │
                   │              │
                   │     ┌────────▼──────────┐
                   │     │  ContactReveal    │
                   │     ├──────────────────┤
                   │     │ id (PK)          │
                   │     │ userId           │
                   │     │ contactId (FK)    │
                   │     │ revealedAt       │
                   │     └──────────────────┘
                   │
┌──────────────────▼──────┐
│      UserLimit           │
├──────────────────────────┤
│ id (PK)                  │
│ userId (Unique)          │
│ count                    │
│ lastViewDate             │
└──────────────────────────┘
```

### Models

#### Agency
- Stores agency information
- Has many contacts
- Fields: `id`, `originalId`, `name`, `state`, `type`, `website`, `createdAt`

#### Contact
- Stores contact information
- Belongs to an agency (optional)
- Fields: `id`, `originalId`, `firstName`, `lastName`, `email`, `phone`, `title`, `agencyId`, `createdAt`

#### UserLimit
- Tracks daily usage per user
- Fields: `id`, `userId` (unique), `count`, `lastViewDate`
- Automatically resets daily

#### ContactReveal
- Tracks which contacts each user has revealed
- Prevents duplicate reveals from counting
- Fields: `id`, `userId`, `contactId`, `revealedAt`
- Unique constraint on `(userId, contactId)`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Supabase account)
- Clerk account for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agency-dashboardn
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # (Optional) Seed the database
   npm run prisma:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Seeding

The project includes CSV data files for seeding:
- `prisma/data/agencies_agency_rows.csv`
- `prisma/data/contacts_contact_rows.csv`

Run the seed script:
```bash
npm run prisma:seed
```

## 📡 API Documentation

### Server Actions

All server actions are located in `lib/actions.ts` and use the `'use server'` directive.

#### `getAgencies(page, pageSize)`
Fetches paginated list of agencies.

**Parameters:**
- `page` (number, default: 1) - Page number
- `pageSize` (number, default: 20) - Items per page

**Returns:**
```typescript
{
  agencies: Agency[],
  total: number,
  totalPages: number
}
```

#### `getAllAgencies()`
Fetches all agencies for dropdown/filter purposes.

**Returns:**
```typescript
Array<{ id: string, name: string }>
```

#### `getContacts(page, pageSize, search, agencyId)`
Fetches paginated list of contacts with optional filtering.

**Parameters:**
- `page` (number, default: 1) - Page number
- `pageSize` (number, default: 20) - Items per page
- `search` (string, default: '') - Search query (name/email)
- `agencyId` (string | undefined) - Filter by agency

**Returns:**
```typescript
{
  contacts: Contact[],
  total: number,
  totalPages: number
}
```

**Note:** Contact emails/phones are masked (`****`) unless already revealed by the user.

#### `revealContactDetails(contactId)`
Reveals contact details and increments usage counter.

**Parameters:**
- `contactId` (string) - Contact ID to reveal

**Returns:**
```typescript
{
  data?: { email: string | null, phone: string | null },
  count: number,
  error?: "LIMIT_REACHED" | "DATABASE_ERROR"
}
```

**Behavior:**
- Checks if contact already revealed (doesn't increment)
- Checks daily limit (50 views)
- Increments counter if under limit
- Returns error if limit reached

#### `getUserUsage()`
Gets current user's daily usage statistics.

**Returns:**
```typescript
{
  count: number,
  lastViewDate: Date
} | null
```

**Behavior:**
- Returns `null` if user not authenticated
- Automatically resets count if new day
- Returns `{ count: 0 }` if no usage record exists

## 🧩 Components Overview

### Layout Components

#### `Sidebar`
- Collapsible sidebar navigation
- User profile display
- Responsive design

#### `Navigation`
- Main navigation menu
- Active route highlighting
- Icon-based navigation

### Feature Components

#### `ContactsTable` (ContactRow)
- Individual contact row display
- "View" button to reveal details
- Loading states
- Revealed contact indicator

#### `ContactsClient`
- Main contacts page client component
- Search and filter functionality
- Pagination controls
- Upgrade dialog integration

#### `AgenciesClient`
- Agencies listing with cards
- Pagination
- Agency details display

#### `UsageCounter`
- Daily usage display
- Progress bar visualization
- Remaining views counter
- Two variants: `compact` and `dashboard`

#### `UpgradeDialog`
- Premium upgrade modal
- Advantages list
- Pricing information
- Call-to-action button

### UI Components

Located in `components/ui/`:
- `button` - Button component with variants
- `card` - Card container component
- `dialog` - Modal dialog component
- `table` - Table components
- `input` - Input field component
- `select` - Select dropdown component
- `badge` - Badge component
- `sonner` - Toast notification system

## 🚢 Deployment

### Environment Variables

Ensure all environment variables are set in your deployment platform:

```env
DATABASE_URL=your_database_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
```

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Database Migration

For production database:
```bash
npx prisma migrate deploy
```

## 📝 Development Notes

### Error Handling

- All database operations have try-catch blocks
- Graceful fallbacks when database is unavailable
- User-friendly error messages

### Performance

- Server-side rendering for initial load
- Client-side pagination and filtering
- Optimized database queries with indexes

### Security

- All sensitive operations are server actions
- Authentication required for data access
- User-specific data isolation
- Contact information masking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is private and proprietary.

---

**Built with ❤️ using Next.js, TypeScript, and Prisma**
