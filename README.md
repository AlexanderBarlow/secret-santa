# 🎄 Secret Santa App

A festive full-stack web app built with **Next.js**, **Prisma**, **Supabase**, and **Framer Motion**, designed to bring the magic of gifting to your team or friend group.  
Users can sign up, create wishlists, and be matched by an admin to a Secret Santa — with a magical reveal animation on the event day.

---

## ✨ Features

### 🎁 For Users
- **Account System** – Users register and sign in using their email. After admin approval, they can create and edit their wishlists.  
- **Wishlist Creation** – Each user can add up to **5 wishlist items** with inappropriate-content detection and validation.  
  Items can be edited, deleted, and saved with animated feedback banners.  
- **Secret Santa Reveal** – Until the reveal date, users’ assigned matches are blurred and locked.  
  When the **matchSantaDate** is reached, a **sparkle unlock animation** plays (only once) revealing their Santa and wishlist.  
- **Ask Questions Feature** – Users can ask anonymous questions about wishlist items and receive replies within the app.  
- **Responsive Design** – Built mobile-first with frosted-glass aesthetics, animated buttons, and a floating bottom navbar.

---

### 🎅 For Admins
- **Admin Dashboard**
  - Approve or deny user accounts.
  - Set or edit **eventDate** and **matchSantaDate**.
  - Pre-assign or auto-generate matches.
  - View all wishlists and user statuses.
- **Match Control** – Matches can be set before the date; users see them only after the reveal.
- **Reset & Control Dates** – Admins can modify event and match dates anytime.

---

## 🧠 App Flow Overview

\```mermaid
flowchart TD
    A[User Signs Up] --> B[Admin Approval]
    B --> C[User Creates Wishlist]
    C --> D[Admin Sets matchSantaDate]
    D --> E[Santa Matching]
    E --> F[User Dashboard Countdown]
    F --> G{Current Date ≥ matchSantaDate?}
    G -- No --> H[Locked View with 🔒 Animation]
    G -- Yes --> I[Reveal Sparkle Animation ✨]
    I --> J[Santa & Wishlist Revealed 🎁]
    J --> K[Users Ask/Answer Questions 💬]
\```

---

## 🧩 Tech Stack

| Layer | Tools Used |
|-------|-------------|
| **Frontend** | Next.js (App Router), React, TailwindCSS, Framer Motion |
| **Backend** | API Routes (Next.js), Prisma ORM |
| **Database** | PostgreSQL via Supabase |
| **Auth** | JWT stored in LocalStorage |
| **UI Components** | Lucide Icons, Custom Motion Components |
| **Styling** | Tailwind Glassmorphism gradients & shadows |
| **Animations** | Framer Motion transitions, unlock sparkles |

---

## 🗂 Database Schema (Prisma)

\```prisma
model User {
  id              Int      @id @default(autoincrement())
  email           String   @unique
  password        String
  isAdmin         Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  updatedPassword Boolean  @default(false)

  wishlist        Wishlist?
  matchedSanta    User?    @relation("UserSanta", fields: [matchedSantaId], references: [id])
  matchedSantaId  Int?     @unique
  matchedBy       User?    @relation("UserSanta")

  Accepted        Boolean  @default(false)
  role            Role     @default(FRONT_OF_HOUSE)
  profilePicture  String

  askedQuestions   Question[] @relation("AskerQuestions")
  receivedQuestions Question[] @relation("ReceiverQuestions")
}

enum Role {
  FRONT_OF_HOUSE
  BACK_OF_HOUSE
}

model Wishlist {
  id            Int           @id @default(autoincrement())
  user          User          @relation(fields: [userId], references: [id])
  userId        Int           @unique
  pendingAccept Boolean       @default(true)
  items         WishlistItem[]

  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
}

model WishlistItem {
  id         Int       @id @default(autoincrement())
  wishlist   Wishlist  @relation(fields: [wishlistId], references: [id])
  wishlistId Int
  item       String
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  questions  Question[]
}

model AdminCode {
  id              Int       @id @default(autoincrement())
  eventDate       DateTime?
  matchSantaDate  DateTime?
  overview        String?
  code            String   @unique
}

model Question {
  id              Int      @id @default(autoincrement())
  askerId         Int
  receiverId      Int
  wishlistItemId  Int
  questionText    String
  answerText      String?
  isAnswered      Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  asker        User         @relation("AskerQuestions", fields: [askerId], references: [id])
  receiver     User         @relation("ReceiverQuestions", fields: [receiverId], references: [id])
  wishlistItem WishlistItem @relation(fields: [wishlistItemId], references: [id])
}
\```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

\```bash
DATABASE_URL="your_supabase_postgres_connection_string"
DIRECT_URL="your_supabase_direct_connection_string"
JWT_SECRET="your_secret_key_here"
NEXT_PUBLIC_SUPABASE_URL="https://yourproject.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="public_anon_key_here"
\```

---

## 🚀 Running Locally

\```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Start the dev server
npm run dev
\```

The app will run at **http://localhost:3000**

---

## 🎨 Design & Experience Notes

- Elegant frosted glass gradients with soft neon glows  
- Smooth Framer Motion transitions and floating snowflake layers  
- Dynamic animations for saving, matching, and revealing  
- Floating, rounded bottom navbar with glowing center icon  
- Perfectly mobile-optimized UI with flexible layouts  

---

## 🔐 Security & Behavior Notes

- Passwords are securely hashed.  
- JWTs are validated for all protected routes.  
- Santa reveal animation plays **once only** (tracked in localStorage).  
- Admin-only pages are protected by role-based access control.  

---

## 🧭 Future Enhancements

- 🎅 Admin “Reveal Now” override button  
- 📦 Gift exchange confirmation system  
- 🌐 Multi-language localization  
- 📱 Push notifications for new replies  
- 🎨 Seasonal theming options  

---

## ❤️ Credits

Built with holiday spirit by **Alex Barlow**  
> “Celebrate the magic of giving — one line of code at a time.”
