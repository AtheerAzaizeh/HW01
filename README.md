# 🎽 BLAKV Hoodie Store

A full-stack e-commerce web application for premium hoodies built with React, Node.js, Express, and MongoDB.

---

## 🌐 Live Demo

| Service              | URL                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------- |
| **Frontend**         | [https://hoodie-store-project.netlify.app](https://hoodie-store-project.netlify.app)   |
| **Backend API**      | [https://hw01-7bba.onrender.com/api](https://hw01-7bba.onrender.com/api)               |
| **API Health Check** | [https://hw01-7bba.onrender.com/api/health](https://hw01-7bba.onrender.com/api/health) |

---

## 🔐 Test Accounts

| Role            | Email                  | Password        | Access                 |
| --------------- | ---------------------- | --------------- | ---------------------- |
| **Super Admin** | `superadmin@blakv.com` | `superadmin123` | Full system control    |
| **Admin**       | `admin@blakv.com`      | `admin123`      | Products, Orders, Chat |
| **User**        | `john@example.com`     | `password123`   | Shop, Orders, Profile  |

---

## 📚 Table of Contents

1. [Architecture Overview](#-architecture-overview)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Frontend](#-frontend)
5. [Backend](#-backend)
6. [Database](#-database)
7. [API Documentation](#-api-documentation)
8. [Custom Hooks](#-custom-hooks)
9. [Context Providers](#-context-providers)
10. [Redux Store](#-redux-store)
11. [Authentication Flow](#-authentication-flow)
12. [Real-Time Features](#-real-time-features)
13. [Setup & Installation](#-setup--installation)
14. [Environment Variables](#-environment-variables)
15. [Deployment](#-deployment)

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│                    (React + Vite + MUI)                        │
│                    Hosted on: Netlify                          │
├─────────────────────────────────────────────────────────────────┤
│  Pages          │  Components      │  State Management         │
│  ─────────────  │  ─────────────   │  ───────────────────      │
│  • Home         │  • Navbar        │  • Redux (Cart)           │
│  • Products     │  • Footer        │  • Context (Auth)         │
│  • Cart         │  • HoodieCard    │  • Context (Notifications)│
│  • Checkout     │  • LoadingSpinner│  • Context (Socket)       │
│  • Login/Reg    │  • ErrorMessage  │  • Local State (useState) │
│  • Admin        │  • ProtectedRoute│                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ HTTP/REST API + WebSocket
                            │ (fetch + socket.io-client)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                          BACKEND                                │
│               (Node.js + Express + Socket.IO)                  │
│                    Hosted on: Render                           │
├─────────────────────────────────────────────────────────────────┤
│  Routes         │  Controllers     │  Middleware               │
│  ─────────────  │  ─────────────   │  ────────────             │
│  • /auth        │  • authController│  • protect (JWT)          │
│  • /products    │  • productCtrl   │  • admin (role check)     │
│  • /orders      │  • orderController│ • validate (express-val) │
│  • /chat        │  • chatController│  • errorHandler           │
│  • /users       │  (in routes)     │                           │
│  • /external    │                  │                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            │ Mongoose ODM
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE                                │
│                    (MongoDB Atlas)                              │
├─────────────────────────────────────────────────────────────────┤
│  Collections:                                                   │
│  • users      - User accounts with roles                       │
│  • products   - Hoodie products                                │
│  • orders     - Customer orders                                │
│  • chats      - Support conversations                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

### Frontend

| Technology            | Purpose                 |
| --------------------- | ----------------------- |
| **React 19**          | UI library              |
| **Vite**              | Build tool & dev server |
| **Material UI (MUI)** | Component library       |
| **React Router v7**   | Client-side routing     |
| **Redux Toolkit**     | Global state (cart)     |
| **Socket.IO Client**  | Real-time communication |

### Backend

| Technology            | Purpose               |
| --------------------- | --------------------- |
| **Node.js**           | Runtime environment   |
| **Express.js**        | Web framework         |
| **Socket.IO**         | Real-time WebSockets  |
| **JWT**               | Authentication tokens |
| **bcryptjs**          | Password hashing      |
| **express-validator** | Request validation    |

### Database & Cloud

| Technology        | Purpose          |
| ----------------- | ---------------- |
| **MongoDB Atlas** | Cloud database   |
| **Mongoose**      | MongoDB ODM      |
| **Cloudinary**    | Image hosting    |
| **Netlify**       | Frontend hosting |
| **Render**        | Backend hosting  |

---

## 📁 Project Structure

```
HW01/
├── 📁 src/                      # Frontend source code
│   ├── 📁 components/           # Reusable UI components
│   │   ├── 📁 common/           # Shared components
│   │   │   ├── EmptyState.jsx   # Empty list placeholder
│   │   │   ├── ErrorMessage.jsx # Error display with retry
│   │   │   ├── LoadingSpinner.jsx # Loading indicator
│   │   │   └── ProtectedRoute.jsx # Auth route wrapper
│   │   ├── 📁 chat/             # Chat components
│   │   │   └── ChatWidget.jsx   # Floating chat widget
│   │   ├── AdminNavbar.jsx      # Admin panel navigation
│   │   ├── Footer.jsx           # Site footer
│   │   ├── GlobalSocketListener.jsx # Socket event handler
│   │   ├── HoodieCard.jsx       # Product card
│   │   └── Navbar.jsx           # Main navigation
│   │
│   ├── 📁 context/              # React Context providers
│   │   ├── AuthContext.jsx      # Authentication state
│   │   ├── NotificationContext.jsx # Toast notifications
│   │   └── SocketContext.jsx    # WebSocket connection
│   │
│   ├── 📁 hooks/                # Custom React hooks
│   │   ├── useApi.js            # Data fetching hook
│   │   ├── useCloudinaryUpload.js # Image upload hook
│   │   ├── useForm.js           # Form handling hook
│   │   └── useLocalStorage.js   # LocalStorage sync hook
│   │
│   ├── 📁 pages/                # Page components (routes)
│   │   ├── Admin.jsx            # Admin dashboard
│   │   ├── Cart.jsx             # Shopping cart
│   │   ├── Checkout.jsx         # Order checkout
│   │   ├── Contact.jsx          # Contact form
│   │   ├── ExternalData.jsx     # External API demo
│   │   ├── Home.jsx             # Homepage
│   │   ├── Login.jsx            # User login
│   │   ├── NotFound.jsx         # 404 page
│   │   ├── Products.jsx         # Product catalog
│   │   ├── Profile.jsx          # User profile
│   │   ├── Register.jsx         # User registration
│   │   └── Support.jsx          # Support chat
│   │
│   ├── 📁 store/                # Redux store
│   │   ├── index.js             # Store configuration
│   │   └── cartSlice.js         # Cart state slice
│   │
│   ├── 📁 services/             # API service layer
│   │   └── api.js               # Centralized API calls
│   │
│   ├── 📁 utils/                # Utility functions
│   │   └── validators.js        # Form validation rules
│   │
│   ├── App.jsx                  # Root component with routes
│   ├── main.jsx                 # React entry point
│   └── theme.js                 # MUI theme configuration
│
├── 📁 server/                   # Backend source code
│   ├── 📁 config/
│   │   └── db.js                # MongoDB connection
│   │
│   ├── 📁 controllers/          # Request handlers
│   │   ├── authController.js    # Auth logic
│   │   ├── chatController.js    # Chat logic
│   │   ├── orderController.js   # Order logic
│   │   └── productController.js # Product logic
│   │
│   ├── 📁 middleware/           # Express middleware
│   │   ├── auth.js              # JWT verification
│   │   ├── errorHandler.js      # Global error handler
│   │   └── validate.js          # Validation handler
│   │
│   ├── 📁 models/               # Mongoose schemas
│   │   ├── Chat.js              # Chat model
│   │   ├── Order.js             # Order model
│   │   ├── Product.js           # Product model
│   │   └── User.js              # User model
│   │
│   ├── 📁 routes/               # API route definitions
│   │   ├── auth.js              # Auth routes
│   │   ├── chat.js              # Chat routes
│   │   ├── external.js          # External data routes
│   │   ├── orders.js            # Order routes
│   │   ├── products.js          # Product routes
│   │   └── users.js             # User management routes
│   │
│   ├── seed.js                  # Database seeder
│   └── server.js                # Express app entry
│
├── 📁 public/                   # Static files
│   └── _redirects               # Netlify SPA routing
│
├── .env.example                 # Frontend env template
├── netlify.toml                 # Netlify configuration
├── render.yaml                  # Render configuration
├── package.json                 # Frontend dependencies
└── README.md                    # This file
```

---

## 🖥 Frontend

### Pages

| Page              | Route       | Description                                                | Auth Required      |
| ----------------- | ----------- | ---------------------------------------------------------- | ------------------ |
| **Home**          | `/`         | Landing page with hero, featured products, recently viewed | No                 |
| **Products**      | `/products` | Full product catalog with search, filter, sort             | No                 |
| **External Data** | `/api`      | Demo of external API data fetching                         | No                 |
| **Cart**          | `/cart`     | Shopping cart with quantities                              | No                 |
| **Checkout**      | `/checkout` | Order form with shipping address                           | No (guest allowed) |
| **Login**         | `/login`    | User authentication                                        | No                 |
| **Register**      | `/register` | New account creation                                       | No                 |
| **Profile**       | `/profile`  | User profile management                                    | Yes                |
| **Support**       | `/support`  | Real-time chat with admin                                  | Yes                |
| **Admin**         | `/admin`    | Admin dashboard (products, orders, users, chats)           | Yes (Admin)        |
| **Not Found**     | `*`         | 404 error page                                             | No                 |

### How Pages Work

#### Home Page (`/`)

1. Uses `useApi` hook to fetch products from `/api/products`
2. Filters products into "Featured" and "Latest Drops"
3. Uses `useLocalStorage` to track "Recently Viewed" items
4. Dispatches `addItem` to Redux when adding to cart

#### Products Page (`/products`)

1. Fetches products with filters (category, sort, search)
2. Uses debounced search (500ms delay)
3. Shows `LoadingSpinner`, `ErrorMessage`, or `EmptyState` based on state
4. Each `HoodieCard` can add items to Redux cart

#### Cart Page (`/cart`)

1. Uses `useSelector` to read cart items from Redux
2. Uses `useDispatch` to update quantities or remove items
3. Calculates totals and shows order summary
4. Links to checkout for authenticated or guest users

#### Checkout Page (`/checkout`)

1. Uses `useForm` hook for form handling
2. Validates shipping address with `shippingValidator`
3. For logged-in users: POSTs to `/api/orders`
4. For guests: POSTs to `/api/orders/guest`
5. Clears cart on successful order

#### Admin Page (`/admin`)

1. Protected by `ProtectedRoute` with `adminOnly={true}`
2. Tabs: Products, Orders, Users (superadmin), Chats
3. CRUD operations for products with `useCloudinaryUpload`
4. Real-time chat with Socket.IO

---

## ⚙️ Backend

### Routes Overview

| Route Group | Base Path       | Purpose                      |
| ----------- | --------------- | ---------------------------- |
| Auth        | `/api/auth`     | Login, Register, Profile     |
| Products    | `/api/products` | Product CRUD                 |
| Orders      | `/api/orders`   | Order management             |
| Chat        | `/api/chat`     | Support messaging            |
| Users       | `/api/users`    | User management (SuperAdmin) |
| External    | `/api/external` | External API demos           |

### Middleware Stack

```javascript
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use((req, res, next) => {
  req.io = io;
  next();
}); // Socket.IO
```

### Authentication Middleware

```javascript
// protect - Requires valid JWT token
export const protect = async (req, res, next) => {
  // 1. Extract token from Authorization header
  // 2. Verify with jwt.verify()
  // 3. Attach user to req.user
};

// admin - Requires admin or superadmin role
export const admin = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "superadmin") next();
};

// superAdmin - Requires superadmin role only
export const superAdmin = (req, res, next) => {
  if (req.user.role === "superadmin") next();
};
```

---

## 🗄 Database

### Models

#### User Model

```javascript
{
  name: String (required, min 2 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  role: 'user' | 'admin' | 'superadmin',
  isAdmin: Boolean (derived from role),
  createdAt: Date
}
```

**Features:**

- Password auto-hashed with bcrypt before save
- `comparePassword()` method for login
- `isAdmin` computed from role

#### Product Model

```javascript
{
  name: String (required, max 100),
  description: String (required, max 500),
  price: Number (required, >= 0),
  image: String (required, valid URL),
  category: 'pullover' | 'zip-up' | 'oversized' | 'premium' | 'limited',
  stock: Number (default 0),
  featured: Boolean (default false),
  createdAt: Date
}
```

#### Order Model

```javascript
{
  user: ObjectId (ref: User, optional for guests),
  items: [{
    product: ObjectId,
    name: String,
    image: String,
    price: Number,
    quantity: Number
  }],
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
    phone: String (optional)
  },
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  totalPrice: Number,
  discount: Number,
  guestEmail: String (for guest orders),
  isGuest: Boolean,
  createdAt: Date
}
```

#### Chat Model

```javascript
{
  user: ObjectId (ref: User),
  subject: String (max 100),
  messages: [{
    sender: ObjectId (ref: User),
    senderName: String,
    content: String (max 1000),
    isAdmin: Boolean,
    createdAt: Date
  }],
  status: 'open' | 'in-progress' | 'closed',
  createdAt: Date
}
```

---

## 📡 API Documentation

### Authentication APIs

| Method | Endpoint             | Description              | Auth |
| ------ | -------------------- | ------------------------ | ---- |
| POST   | `/api/auth/register` | Create new user account  | No   |
| POST   | `/api/auth/login`    | Login and get JWT token  | No   |
| GET    | `/api/auth/me`       | Get current user profile | Yes  |
| PUT    | `/api/auth/profile`  | Update user profile      | Yes  |

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "John Doe", "email": "...", "role": "user" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Product APIs

| Method | Endpoint            | Description                     | Auth  |
| ------ | ------------------- | ------------------------------- | ----- |
| GET    | `/api/products`     | Get all products (with filters) | No    |
| GET    | `/api/products/:id` | Get single product              | No    |
| POST   | `/api/products`     | Create product                  | Admin |
| PUT    | `/api/products/:id` | Update product                  | Admin |
| DELETE | `/api/products/:id` | Delete product                  | Admin |

#### Query Parameters (GET /products)

| Param      | Example     | Description                |
| ---------- | ----------- | -------------------------- |
| `category` | `pullover`  | Filter by category         |
| `sort`     | `price-asc` | Sort order                 |
| `search`   | `black`     | Search in name/description |

---

### Order APIs

| Method | Endpoint                 | Description                   | Auth  |
| ------ | ------------------------ | ----------------------------- | ----- |
| POST   | `/api/orders`            | Create order (logged in user) | Yes   |
| POST   | `/api/orders/guest`      | Create guest order            | No    |
| GET    | `/api/orders`            | Get my orders                 | Yes   |
| GET    | `/api/orders/:id`        | Get single order              | Yes   |
| GET    | `/api/orders/admin/all`  | Get all orders                | Admin |
| PUT    | `/api/orders/:id/status` | Update order status           | Admin |

---

### Chat APIs

| Method | Endpoint                | Description            | Auth  |
| ------ | ----------------------- | ---------------------- | ----- |
| POST   | `/api/chat`             | Create new chat        | Yes   |
| GET    | `/api/chat`             | Get my chats           | Yes   |
| GET    | `/api/chat/:id`         | Get chat with messages | Yes   |
| POST   | `/api/chat/:id/message` | Add message to chat    | Yes   |
| GET    | `/api/chat/admin/all`   | Get all chats          | Admin |
| PUT    | `/api/chat/:id/status`  | Update chat status     | Admin |

---

### User Management APIs (SuperAdmin Only)

| Method | Endpoint              | Description       | Auth       |
| ------ | --------------------- | ----------------- | ---------- |
| GET    | `/api/users`          | Get all users     | SuperAdmin |
| POST   | `/api/users/admin`    | Create admin user | SuperAdmin |
| PUT    | `/api/users/:id/role` | Change user role  | SuperAdmin |
| DELETE | `/api/users/:id`      | Delete user       | SuperAdmin |

---

### External APIs (Demo/Mock)

| Method | Endpoint                   | Description                |
| ------ | -------------------------- | -------------------------- |
| GET    | `/api/external/scrape`     | Get sample hoodie products |
| GET    | `/api/external/weather`    | Get mock weather data      |
| GET    | `/api/external/currencies` | Get mock currency rates    |
| GET    | `/api/external/github`     | Get mock GitHub info       |

---

## 🪝 Custom Hooks

### `useLocalStorage(key, initialValue)`

Syncs React state with localStorage for persistence.

```javascript
const [theme, setTheme] = useLocalStorage("theme", "dark");
```

**Used In:**

- `App.jsx` - Theme persistence
- `Home.jsx` - Recently viewed products

---

### `useApi(url, options)`

Fetches data from API with loading/error states.

```javascript
const { data, loading, error, refetch } = useApi("/api/products");
```

**Returns:**
| Property | Type | Description |
|----------|------|-------------|
| `data` | any | Response data |
| `loading` | boolean | Loading state |
| `error` | string | Error message |
| `refetch` | function | Re-fetch data |

**Used In:**

- `Home.jsx` - Fetch products
- `ExternalData.jsx` - Fetch external hoodies

---

### `useForm(initialValues, validate, onSubmit)`

Handles form state, validation, and submission.

```javascript
const {
  values,
  errors,
  touched,
  isSubmitting,
  handleChange,
  handleBlur,
  handleSubmit,
} = useForm({ email: "", password: "" }, loginValidator, handleLogin);
```

**Features:**

- Controlled input handling
- Blur validation
- Server error mapping
- Submit state management

**Used In:**

- `Login.jsx`, `Register.jsx`, `Contact.jsx`, `Checkout.jsx`

---

### `useCloudinaryUpload()`

Uploads images to Cloudinary with progress tracking.

```javascript
const { uploadImage, uploading, progress, error } = useCloudinaryUpload();

const url = await uploadImage(file);
```

**Returns:**
| Property | Type | Description |
|----------|------|-------------|
| `uploadImage` | function | Upload file, returns URL |
| `uploading` | boolean | Upload in progress |
| `progress` | number | 0-100 percent |
| `error` | string | Error message |

**Used In:**

- `Admin.jsx` - Product image upload

---

## 🌐 Context Providers

### AuthContext

Manages user authentication state globally.

```javascript
const { user, isAuthenticated, isAdmin, login, logout, loading } = useAuth();
```

**State:**
| Property | Type | Description |
|----------|------|-------------|
| `user` | object | Current user data |
| `isAuthenticated` | boolean | Login status |
| `isAdmin` | boolean | Admin check |
| `loading` | boolean | Auth check in progress |

**Methods:**
| Method | Parameters | Description |
|--------|------------|-------------|
| `login` | credentials | Authenticate user |
| `logout` | - | Clear auth state |
| `register` | userData | Create account |

**Token Storage:** JWT stored in `localStorage` as `token`

---

### NotificationContext

Global toast notification system.

```javascript
const { notifySuccess, notifyError, notifyInfo, notifyWarning } =
  useNotification();

notifySuccess("Item added!", "Cart Updated");
```

**Methods:**
| Method | Parameters | Description |
|--------|------------|-------------|
| `notifySuccess` | (message, title) | Green success toast |
| `notifyError` | (message, title) | Red error toast |
| `notifyInfo` | (message, title) | Blue info toast |
| `notifyWarning` | (message, title) | Orange warning toast |

---

### SocketContext

WebSocket connection for real-time features.

```javascript
const socket = useSocket();

socket.on('new_message', (data) => { ... });
socket.emit('join_chat', chatId);
```

**Connection:**

- Connects when user logs in
- Disconnects on logout
- Auto-joins user room for notifications

---

## 🛒 Redux Store

### Cart Slice

**State Shape:**

```javascript
{
  cart: {
    items: [
      { id, name, price, image, quantity }
    ],
    totalCount: number,
    lastUpdated: string (ISO date)
  }
}
```

**Actions:**
| Action | Payload | Description |
|--------|---------|-------------|
| `addItem` | product object | Add/increment item |
| `removeItem` | productId | Remove item |
| `updateQuantity` | { id, quantity } | Set quantity |
| `clearCart` | - | Empty cart |

**Selectors:**

```javascript
import { selectCartItems, selectCartCount } from "../store/cartSlice";

const items = useSelector(selectCartItems);
const count = useSelector(selectCartCount);
```

**Persistence:**
Cart auto-saves to localStorage via middleware.

---

## 🔐 Authentication Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │     │   Backend    │     │   Database   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       │  POST /auth/login  │                    │
       │  {email, password} │                    │
       │───────────────────>│                    │
       │                    │  Find user by email│
       │                    │───────────────────>│
       │                    │    User document   │
       │                    │<───────────────────│
       │                    │                    │
       │                    │ Compare password   │
       │                    │ (bcrypt)           │
       │                    │                    │
       │                    │ Generate JWT       │
       │                    │ (7 days expiry)    │
       │                    │                    │
       │  {user, token}     │                    │
       │<───────────────────│                    │
       │                    │                    │
       │ Store token in     │                    │
       │ localStorage       │                    │
       │                    │                    │
       │  GET /products     │                    │
       │  Authorization:    │                    │
       │  Bearer <token>    │                    │
       │───────────────────>│                    │
       │                    │ Verify JWT         │
       │                    │ Attach user to req │
       │                    │                    │
       │  {products}        │                    │
       │<───────────────────│                    │
```

---

## ⚡ Real-Time Features

### Socket.IO Events

**Client → Server:**
| Event | Data | Description |
|-------|------|-------------|
| `join_chat` | chatId | Join chat room |
| `leave_chat` | chatId | Leave chat room |
| `join_user` | userId | Join user notification room |

**Server → Client:**
| Event | Data | Description |
|-------|------|-------------|
| `new_message` | message object | New chat message |
| `chat_status_updated` | { chatId, status } | Status change |

### How Real-Time Chat Works

1. User opens Support page → `socket.emit('join_chat', chatId)`
2. User sends message → POST to `/api/chat/:id/message`
3. Server saves message → `io.to(chatId).emit('new_message', message)`
4. All connected users in that chat receive the message instantly

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Clone Repository

```bash
git clone https://github.com/AtheerAzaizeh/HW01.git
cd HW01
```

### Install Dependencies

```bash
# Frontend
npm install

# Backend
cd server
npm install
```

### Setup Environment Variables

```bash
# Frontend - copy and edit
cp .env.example .env

# Backend - copy and edit
cp server/.env.example server/.env
```

### Seed Database

```bash
cd server
npm run seed
```

### Run Development Servers

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Access Application

- Frontend: http://localhost:5173/
- Backend: https: http://localhost:5000

---

## 🔧 Environment Variables

### Frontend (`.env`)

```env
# API URL (local or production)
VITE_API_URL=https://hw01-7bba.onrender.com/api

# Cloudinary (for image uploads)
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-preset
```

### Backend (`server/.env`)

```env
# Server port
PORT=5000

# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/blakv

# JWT configuration
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d

# CORS - Frontend URL (for production)
FRONTEND_URL=https://hoodie-store-project.netlify.app
```

---

## ☁️ Deployment

### MongoDB Atlas

1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Add database user with password
3. Whitelist IP `0.0.0.0/0`
4. Get connection string

### Backend on Render

1. Create Web Service at [render.com](https://render.com)
2. Connect GitHub repository
3. Set root directory: `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables (MONGODB_URI, JWT_SECRET, FRONTEND_URL)

### Frontend on Netlify

1. Create site at [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable: `VITE_API_URL , VITE_CLOUDINARY_CLOUD_NAME , VITE_CLOUDINARY_UPLOAD_PRESET`

---

## 📝 License

This project was created for the React Course Final Project.

---

## 👤 Author

**Atheer Azaizeh**

- GitHub: [@AtheerAzaizeh](https://github.com/AtheerAzaizeh)
