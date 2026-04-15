# ✦ Nomadly — Travel Booking SaaS

Next.js 14 + Prisma + **MySQL** + JWT дээр суурилсан Travel Booking SaaS систем.

## Технологийн stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MySQL + Prisma ORM
- **Auth**: JWT (jose) + bcryptjs
- **Styling**: CSS Modules + Google Fonts
- **Deployment**: Vercel

## Хурдан эхлэх

### 1. Repository clone хийх

```bash
git clone https://github.com/your-username/nomadly.git
cd nomadly
```

### 2. Dependencies суулгах

```bash
npm install
```

### 3. MySQL database үүсгэх

MySQL-д нэвтэрч database үүсгэнэ:

```sql
CREATE DATABASE nomadly CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Environment variables тохируулах

```bash
cp .env.example .env.local
```

`.env.local` файлд MySQL connection string оруулна:

```env
DATABASE_URL="mysql://username:password@localhost:3306/nomadly"
JWT_SECRET="your-super-secret-key-at-least-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Database тохируулах

```bash
# Schema push (table-уудыг үүсгэнэ)
npm run db:push

# Seed data оруулах (тест бүртгэл үүсгэнэ)
npm run db:seed
```

### 6. Dev server эхлүүлэх

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) дээр нээгдэнэ.

## Тест бүртгэл

| Роль  | И-мэйл               | Нууц үг   |
|-------|-----------------------|-----------|
| ADMIN | admin@nomadly.mn      | admin123  |
| USER  | bayar@nomadly.mn      | user123   |

## Хуудсуудын жагсаалт

| Route                    | Тайлбар                          | Хамгаалалт |
|--------------------------|----------------------------------|------------|
| `/`                      | Нүүр хуудас                      | Нийтийн   |
| `/tours`                 | Бүх аяллын жагсаалт              | Нийтийн   |
| `/tours/[id]`            | Аяллын дэлгэрэнгүй               | Нийтийн   |
| `/login`                 | Нэвтрэх хуудас                   | Нийтийн   |
| `/register`              | Бүртгүүлэх хуудас                | Нийтийн   |
| `/dashboard`             | Хэрэглэгчийн хяналтын самбар     | USER+      |
| `/admin`                 | Админ хяналтын самбар            | ADMIN      |
| `/admin/tours/new`       | Шинэ тур нэмэх                   | ADMIN      |
| `/admin/tours/[id]/edit` | Тур засах                        | ADMIN      |

## API Endpoints

```
POST   /api/auth/register     — Бүртгэл
POST   /api/auth/login        — Нэвтрэх
POST   /api/auth/logout       — Гарах

GET    /api/tours             — Бүх тур жагсаалт
POST   /api/tours             — Шинэ тур (ADMIN)
GET    /api/tours/[id]        — Тур дэлгэрэнгүй
PUT    /api/tours/[id]        — Тур засах (ADMIN)
DELETE /api/tours/[id]        — Тур устгах (ADMIN)

GET    /api/bookings          — Захиалга жагсаалт
POST   /api/bookings          — Шинэ захиалга (USER)

GET    /api/users             — Хэрэглэгч жагсаалт (ADMIN)
```

## Vercel дээр deploy хийх

### 1. GitHub-т push хийх

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/nomadly.git
git push -u origin main
```

### 2. Vercel дээр project үүсгэх

1. [vercel.com](https://vercel.com) дээр нэвтэрнэ
2. "New Project" товч дарна
3. GitHub repo-оо сонгоно
4. Environment variables нэмнэ:
   - `DATABASE_URL` — Production MySQL URL
   - `JWT_SECRET` — Аюулгүй урт string
   - `NEXT_PUBLIC_APP_URL` — Vercel domain

### Санал болгох MySQL providers (cloud)

- [PlanetScale](https://planetscale.com) — Serverless MySQL, үнэгүй tier байдаг
- [Railway](https://railway.app) — Хялбар MySQL deploy
- [Aiven](https://aiven.io) — Managed MySQL

> **PlanetScale ашиглах бол:** `relationMode = "prisma"` тохиргоо schema.prisma-д нэмэх шаардлагатай, учир нь PlanetScale foreign key-г дэмждэггүй.

## Аюулгүй байдлын онцлогууд

- ✅ Password bcrypt hash (cost factor: 12)
- ✅ JWT httpOnly cookie (XSS-с хамгаалагдсан)
- ✅ Middleware protected routes
- ✅ Role-based access control (USER/ADMIN)
- ✅ User өөрийн захиалгыг л харна
- ✅ Admin routes тусдаа хамгаалалттай
- ✅ Environment variables (.env gitignore-д орсон)


## Технологийн stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT (jose) + bcryptjs
- **Styling**: CSS Modules + Google Fonts
- **Deployment**: Vercel

## Хурдан эхлэх

### 1. Repository clone хийх

```bash
git clone https://github.com/your-username/nomadly.git
cd nomadly
```

### 2. Dependencies суулгах

```bash
npm install
```

### 3. Environment variables тохируулах

```bash
cp .env.example .env.local
```

`.env.local` файлд дараах утгуудыг оруулна:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/nomadly"
JWT_SECRET="your-super-secret-key-at-least-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database тохируулах

```bash
# Schema push
npm run db:push

# Seed data оруулах (тест бүртгэл үүсгэнэ)
npm run db:seed
```

### 5. Dev server эхлүүлэх

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) дээр нээгдэнэ.

## Тест бүртгэл

Seed хийсний дараа дараах бүртгэлүүдийг ашиглана:

| Роль  | И-мэйл               | Нууц үг   |
|-------|-----------------------|-----------|
| ADMIN | admin@nomadly.mn      | admin123  |
| USER  | bayar@nomadly.mn      | user123   |

## Хуудсуудын жагсаалт

| Route                  | Тайлбар                          | Хамгаалалт |
|------------------------|----------------------------------|------------|
| `/`                    | Нүүр хуудас                      | Нийтийн   |
| `/tours`               | Бүх аяллын жагсаалт              | Нийтийн   |
| `/tours/[id]`          | Аяллын дэлгэрэнгүй               | Нийтийн   |
| `/login`               | Нэвтрэх хуудас                   | Нийтийн   |
| `/register`            | Бүртгүүлэх хуудас                | Нийтийн   |
| `/dashboard`           | Хэрэглэгчийн хяналтын самбар     | USER+      |
| `/admin`               | Админ хяналтын самбар            | ADMIN      |
| `/admin/tours/new`     | Шинэ тур нэмэх                   | ADMIN      |
| `/admin/tours/[id]/edit` | Тур засах                      | ADMIN      |

## API Endpoints

```
POST   /api/auth/register     — Бүртгэл
POST   /api/auth/login        — Нэвтрэх
POST   /api/auth/logout       — Гарах

GET    /api/tours             — Бүх тур жагсаалт
POST   /api/tours             — Шинэ тур (ADMIN)
GET    /api/tours/[id]        — Тур дэлгэрэнгүй
PUT    /api/tours/[id]        — Тур засах (ADMIN)
DELETE /api/tours/[id]        — Тур устгах (ADMIN)

GET    /api/bookings          — Захиалга жагсаалт
POST   /api/bookings          — Шинэ захиалга (USER)

GET    /api/users             — Хэрэглэгч жагсаалт (ADMIN)
```

## Vercel дээр deploy хийх

### 1. GitHub-т push хийх

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/nomadly.git
git push -u origin main
```

### 2. Vercel дээр project үүсгэх

1. [vercel.com](https://vercel.com) дээр нэвтэрнэ
2. "New Project" товч дарна
3. GitHub repo-оо сонгоно
4. Environment variables нэмнэ:
   - `DATABASE_URL` — Production PostgreSQL URL (Supabase, Neon, Railway гэх мэт)
   - `JWT_SECRET` — Аюулгүй урт string
   - `NEXT_PUBLIC_APP_URL` — Vercel domain

### 3. Database seed хийх (production)

Vercel deployment хийсний дараа:

```bash
# Local-аас production DB руу seed хийх
DATABASE_URL="your-production-db-url" npm run db:seed
```

## Санал болгох Database providers

- [Supabase](https://supabase.com) — Үнэгүй PostgreSQL
- [Neon](https://neon.tech) — Serverless PostgreSQL
- [Railway](https://railway.app) — Хялбар deploy

## Аюулгүй байдлын онцлогууд

- ✅ Password bcrypt hash (cost factor: 12)
- ✅ JWT httpOnly cookie (XSS-с хамгаалагдсан)
- ✅ Middleware protected routes
- ✅ Role-based access control (USER/ADMIN)
- ✅ User өөрийн захиалгыг л харна
- ✅ Admin routes тусдаа хамгаалалттай
- ✅ Environment variables (.env gitignore-д орсон)

## Хавтасны бүтэц

```
nomadly/
├── prisma/
│   ├── schema.prisma        # Database схем
│   └── seed.ts              # Тест өгөгдөл
├── src/
│   ├── app/
│   │   ├── api/             # API routes
│   │   │   ├── auth/        # Login, Register, Logout
│   │   │   ├── tours/       # Tours CRUD
│   │   │   ├── bookings/    # Booking management
│   │   │   └── users/       # User management
│   │   ├── admin/           # Admin pages
│   │   ├── dashboard/       # User dashboard
│   │   ├── tours/           # Tour pages
│   │   ├── login/           # Auth pages
│   │   ├── register/
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/Navbar.tsx
│   │   └── ui/LogoutButton.tsx
│   ├── lib/
│   │   ├── db.ts            # Prisma client
│   │   └── auth.ts          # JWT helpers
│   └── middleware.ts        # Route protection
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
└── tsconfig.json
```
