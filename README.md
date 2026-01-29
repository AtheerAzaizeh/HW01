# BLAKV Hoodie Store

A full-stack e-commerce application for premium hoodies, built with React, Node.js, Express, and MongoDB.

![BLAKV Store](https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80)

## 🚀 Tech Stack

### Frontend

- **React 19** - UI library
- **Redux Toolkit** - State management (cart)
- **React Router** - Navigation
- **Material UI** - Component library
- **Vite** - Build tool

### Backend

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## 📁 Project Structure

```
HW01/
├── src/                      # React Frontend
│   ├── components/
│   │   ├── common/           # Reusable components
│   │   └── ...
│   ├── pages/                # Page components
│   ├── hooks/                # Custom hooks
│   │   ├── useLocalStorage   # Persistent state
│   │   ├── useApi            # API fetching
│   │   └── useForm           # Form handling
│   ├── store/                # Redux store
│   ├── context/              # Auth context
│   ├── services/             # API service
│   └── utils/                # Validators
├── server/                   # Node.js Backend
│   ├── config/               # DB configuration
│   ├── controllers/          # Route handlers
│   ├── middleware/           # Auth, validation, errors
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API routes
│   └── server.js             # Entry point
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd HW01
```

### 2. Server Setup

```bash
cd server
npm install
```

Create `.env` file (or copy from `.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blakv
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
```

**For MongoDB Atlas:**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blakv
```

### 3. Seed Database (Optional but Recommended)

This creates an admin user and 10 sample products:

```bash
npm run seed
```

**Test Accounts:**
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@blakv.com | admin123 |
| User | john@example.com | password123 |

### 4. Start Server

```bash
npm run dev
```

Server runs at: `http://localhost:5000`

### 5. Client Setup

Open a new terminal:

```bash
# From project root (HW01/)
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Start Client

```bash
npm run dev
```

Client runs at: `http://localhost:5173`

## 📱 Features

### User Features

- ✅ Browse hoodie products
- ✅ Filter by category
- ✅ Search products
- ✅ Add to cart
- ✅ User registration & login
- ✅ Place orders
- ✅ View order history
- ✅ Dark/Light theme toggle

### Admin Features

- ✅ Product management (CRUD)
- ✅ View all orders
- ✅ Update order status

## 🔌 API Endpoints

### Auth

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| POST   | `/api/auth/register` | Register user    |
| POST   | `/api/auth/login`    | Login user       |
| GET    | `/api/auth/me`       | Get current user |

### Products

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| GET    | `/api/products`     | Get all products   |
| GET    | `/api/products/:id` | Get single product |
| POST   | `/api/products`     | Create (Admin)     |
| PUT    | `/api/products/:id` | Update (Admin)     |
| DELETE | `/api/products/:id` | Delete (Admin)     |

### Orders

| Method | Endpoint                 | Description           |
| ------ | ------------------------ | --------------------- |
| GET    | `/api/orders`            | Get user's orders     |
| GET    | `/api/orders/:id`        | Get single order      |
| POST   | `/api/orders`            | Create order          |
| GET    | `/api/orders/admin/all`  | All orders (Admin)    |
| PUT    | `/api/orders/:id/status` | Update status (Admin) |

## 🎣 Custom Hooks

### useLocalStorage

```javascript
const [value, setValue] = useLocalStorage("key", initialValue);
```

Used for: Theme preference, recently viewed products

### useApi

```javascript
const { data, loading, error, refetch } = useApi(url);
```

Used for: Product fetching with loading/error states

### useForm

```javascript
const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm(
  initialValues,
  validationFunction,
  onSubmitHandler,
);
```

Used for: Login, Register, Checkout forms with validation

## 🔒 Validation

### Client-Side

- Required field validation
- Email format validation
- Password minimum length (6 chars)
- Password confirmation matching

### Server-Side

- express-validator middleware
- Input sanitization
- Mongoose schema validation
- Meaningful error messages

## 🧪 Error Handling

- Loading spinners during data fetch
- Error messages with retry options
- Empty state displays
- Form validation errors
- Server error handling
- 404 page for unknown routes

## 📦 Environment Variables

### Server (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blakv
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
```

### Client (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Running in Production

### Build Client

```bash
npm run build
```

### Start Server

```bash
cd server
npm start
```

## 📝 License

MIT
