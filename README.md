# BLAKV Hoodie Store

A full-stack e-commerce application for premium hoodies, built with React, Node.js, Express, MongoDB, and real-time Socket.IO support.

![BLAKV Store](https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80)

## 🚀 Tech Stack

### Frontend

- **React 19** - UI library with hooks
- **Redux Toolkit** - State management (cart)
- **React Router v7** - Client-side routing
- **Material UI v7** - Component library
- **Socket.IO Client** - Real-time communication
- **Vite** - Build tool & dev server

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Socket.IO** - Real-time bidirectional communication
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

---

## 📁 Project Structure

```
HW01/
├── src/                          # React Frontend
│   ├── components/               # Reusable UI components
│   │   ├── common/               # Shared components
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ...
│   │   ├── chat/                 # Chat feature components
│   │   │   └── ChatWidget.jsx
│   │   ├── Navbar.jsx            # Main navigation bar
│   │   ├── AdminNavbar.jsx       # Admin-only navigation
│   │   ├── Footer.jsx            # Site footer
│   │   ├── HoodieCard.jsx        # Product card component
│   │   └── GlobalSocketListener.jsx
│   ├── pages/                    # Route page components
│   │   ├── Home.jsx              # Landing page
│   │   ├── Products.jsx          # Product catalog
│   │   ├── ExternalData.jsx      # External API demo
│   │   ├── Cart.jsx              # Shopping cart
│   │   ├── Checkout.jsx          # Checkout process
│   │   ├── Contact.jsx           # Contact form
│   │   ├── Login.jsx             # User login
│   │   ├── Register.jsx          # User registration
│   │   ├── Profile.jsx           # User profile
│   │   ├── Admin.jsx             # Admin dashboard
│   │   ├── Support.jsx           # Customer support chat
│   │   └── NotFound.jsx          # 404 page
│   ├── hooks/                    # Custom React hooks
│   │   ├── useLocalStorage.js    # Persistent localStorage state
│   │   ├── useApi.js             # Data fetching with states
│   │   ├── useForm.js            # Form handling & validation
│   │   └── useCloudinaryUpload.js # Image upload to Cloudinary
│   ├── context/                  # React Context providers
│   │   ├── AuthContext.jsx       # Authentication state
│   │   ├── NotificationContext.jsx # Toast notifications
│   │   └── SocketContext.jsx     # Socket.IO connection
│   ├── store/                    # Redux store
│   │   ├── store.js              # Store configuration
│   │   └── cartSlice.js          # Cart state management
│   ├── services/                 # API service layer
│   │   └── api.js                # Centralized API calls
│   ├── utils/                    # Utility functions
│   │   └── validators.js         # Form validation rules
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # React entry point
│   └── theme.js                  # MUI theme configuration
├── server/                       # Node.js Backend
│   ├── config/                   # Configuration
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/              # Route handlers
│   │   ├── authController.js     # Auth logic
│   │   ├── productController.js  # Product CRUD
│   │   ├── orderController.js    # Order management
│   │   └── chatController.js     # Chat functionality
│   ├── middleware/               # Express middleware
│   │   ├── auth.js               # JWT verification
│   │   ├── validate.js           # Input validation
│   │   └── errorHandler.js       # Error handling
│   ├── models/                   # MongoDB schemas
│   │   ├── User.js               # User model
│   │   ├── Product.js            # Product model
│   │   ├── Order.js              # Order model
│   │   └── Chat.js               # Chat model
│   ├── routes/                   # API route definitions
│   │   ├── auth.js               # Auth routes
│   │   ├── products.js           # Product routes
│   │   ├── orders.js             # Order routes
│   │   ├── chat.js               # Chat routes
│   │   ├── users.js              # User management routes
│   │   └── external.js           # External API routes
│   ├── seed.js                   # Database seeder
│   └── server.js                 # Server entry point
├── public/                       # Static assets
├── package.json                  # Frontend dependencies
└── README.md
```

---

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
| SuperAdmin | admin@blakv.com | admin123 |
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

---

## 📱 Features

### User Features

- ✅ Browse hoodie products with filtering
- ✅ Search products by name/description
- ✅ Add/remove items from cart
- ✅ User registration & login
- ✅ Place orders (authenticated & guest)
- ✅ View order history
- ✅ Real-time support chat
- ✅ Dark/Light theme toggle

### Admin Features

- ✅ Product management (Create, Read, Update, Delete)
- ✅ View and manage all orders
- ✅ Update order status
- ✅ Real-time chat with customers
- ✅ User management (SuperAdmin only)

---

## 🔌 API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint    | Description         | Auth Required |
| ------ | ----------- | ------------------- | ------------- |
| POST   | `/register` | Register new user   | No            |
| POST   | `/login`    | Login user          | No            |
| GET    | `/me`       | Get current user    | Yes           |
| PUT    | `/profile`  | Update user profile | Yes           |

### Products (`/api/products`)

| Method | Endpoint | Description        | Auth Required |
| ------ | -------- | ------------------ | ------------- |
| GET    | `/`      | Get all products   | No            |
| GET    | `/:id`   | Get single product | No            |
| POST   | `/`      | Create product     | Admin         |
| PUT    | `/:id`   | Update product     | Admin         |
| DELETE | `/:id`   | Delete product     | Admin         |

### Orders (`/api/orders`)

| Method | Endpoint      | Description         | Auth Required |
| ------ | ------------- | ------------------- | ------------- |
| GET    | `/`           | Get user's orders   | Yes           |
| GET    | `/:id`        | Get single order    | Yes           |
| POST   | `/`           | Create order        | Yes           |
| POST   | `/guest`      | Create guest order  | No            |
| GET    | `/admin/all`  | Get all orders      | Admin         |
| PUT    | `/:id/status` | Update order status | Admin         |

### Chat (`/api/chat`)

| Method | Endpoint       | Description         | Auth Required |
| ------ | -------------- | ------------------- | ------------- |
| GET    | `/`            | Get user's chats    | Yes           |
| POST   | `/`            | Create new chat     | Yes           |
| GET    | `/:id`         | Get single chat     | Yes           |
| POST   | `/:id/message` | Add message to chat | Yes           |
| GET    | `/admin/all`   | Get all chats       | Admin         |
| PUT    | `/:id/status`  | Update chat status  | Admin         |

### Users (`/api/users`) - SuperAdmin Only

| Method | Endpoint    | Description       | Auth Required |
| ------ | ----------- | ----------------- | ------------- |
| GET    | `/`         | Get all users     | SuperAdmin    |
| POST   | `/admin`    | Create admin user | SuperAdmin    |
| PUT    | `/:id/role` | Update user role  | SuperAdmin    |
| DELETE | `/:id`      | Delete user       | SuperAdmin    |

### External (`/api/external`)

| Method | Endpoint      | Description                 | Auth Required |
| ------ | ------------- | --------------------------- | ------------- |
| GET    | `/weather`    | Get weather data (demo)     | No            |
| GET    | `/currencies` | Get currency exchange rates | No            |
| GET    | `/github`     | Get GitHub repository info  | No            |

### Health Check

| Method | Endpoint      | Description         |
| ------ | ------------- | ------------------- |
| GET    | `/api/health` | Server health check |

---

## 🎣 Custom Hooks

### useLocalStorage

Syncs React state with localStorage for persistence across sessions.

```javascript
const [value, setValue] = useLocalStorage("key", initialValue);
```

**Used for:** Theme preference, cart data

---

### useApi

Handles data fetching with loading, error, and refetch states.

```javascript
const { data, loading, error, refetch } = useApi(url, options);
```

**Used for:** Product listing, order history

---

### useForm

Complete form handling with validation, touched states, and submission.

```javascript
const {
  values,
  errors,
  touched,
  isSubmitting,
  handleChange,
  handleBlur,
  handleSubmit,
  setFieldValue,
  setFieldError,
  resetForm,
} = useForm(initialValues, validationFunction, onSubmitHandler);
```

**Used for:** Login, Register, Checkout, Contact forms

---

### useCloudinaryUpload

Handles image uploads to Cloudinary with progress tracking.

```javascript
const { upload, uploading, progress, error, url } = useCloudinaryUpload();

// Usage
const imageUrl = await upload(file);
```

**Used for:** Product image uploads in admin panel

---

## 🌐 Context Providers

### AuthContext

Manages authentication state throughout the app.

```javascript
const {
  user, // Current user object
  loading, // Auth loading state
  error, // Auth error
  isAuthenticated, // Boolean - logged in?
  isAdmin, // Boolean - admin role?
  isSuperAdmin, // Boolean - superadmin role?
  role, // 'user' | 'admin' | 'superadmin'
  register, // Register function
  login, // Login function
  logout, // Logout function
  updateProfile, // Update profile function
} = useAuth();
```

---

### NotificationContext

Provides toast notifications throughout the app.

```javascript
const {
  notifySuccess, // (message, title?) => void
  notifyError, // (message, title?) => void
  notifyWarning, // (message, title?) => void
  notifyInfo, // (message, title?) => void
} = useNotification();
```

---

### SocketContext

Manages Socket.IO connection for real-time features.

```javascript
const { socket, connected } = useSocket();

// Emit events
socket.emit('join_chat', chatId);

// Listen for events
socket.on('new_message', (data) => { ... });
```

---

## 🔄 Real-Time Features (Socket.IO)

The app uses Socket.IO for real-time bidirectional communication:

### Socket Events

| Event           | Direction       | Description               |
| --------------- | --------------- | ------------------------- |
| `join_chat`     | Client → Server | Join a chat room          |
| `leave_chat`    | Client → Server | Leave a chat room         |
| `join_user`     | Client → Server | Join user-specific room   |
| `new_message`   | Server → Client | New chat message received |
| `chat_updated`  | Server → Client | Chat status changed       |
| `order_updated` | Server → Client | Order status changed      |

### Usage Flow

1. **Connection**: Socket connects automatically when app loads (via SocketProvider)
2. **User Room**: After login, user joins their personal room for notifications
3. **Chat Rooms**: When opening a chat, user joins that specific chat room
4. **Real-time Updates**: Messages and status changes broadcast to all room members

---

## 📦 Page Descriptions

| Page             | Route       | Description                                                       |
| ---------------- | ----------- | ----------------------------------------------------------------- |
| **Home**         | `/`         | Landing page with hero banner, featured products, and brand story |
| **Products**     | `/products` | Full product catalog with search, filter by category              |
| **ExternalData** | `/api`      | Demo page showing external API integration                        |
| **Cart**         | `/cart`     | Shopping cart with quantity controls and totals                   |
| **Checkout**     | `/checkout` | Order form with shipping details and payment                      |
| **Contact**      | `/contact`  | Contact form for general inquiries                                |
| **Login**        | `/login`    | User authentication form                                          |
| **Register**     | `/register` | New user registration form                                        |
| **Profile**      | `/profile`  | User profile with order history (protected)                       |
| **Support**      | `/support`  | Real-time chat with customer support (protected)                  |
| **Admin**        | `/admin`    | Admin dashboard for products, orders, chats, users                |
| **NotFound**     | `*`         | 404 error page                                                    |

---

## 🔒 Validation

### Client-Side

- Required field validation
- Email format validation
- Password minimum length (6 characters)
- Password confirmation matching
- Real-time validation on blur

### Server-Side

- express-validator middleware
- Input sanitization
- Mongoose schema validation
- Meaningful error messages with field identification

---

## 🧪 Error Handling

- Loading spinners during async operations
- Error messages with retry options
- Empty state displays for no data
- Form validation errors with field highlighting
- Server error handling with user-friendly messages
- 404 page for unknown routes
- Global error boundary for React errors

---

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
VITE_CLOUDINARY_URL=your-cloudinary-url (optional)
```

---

## 🚀 Running in Production

### Build Client

```bash
npm run build
```

Output will be in `dist/` folder.

### Start Server

```bash
cd server
NODE_ENV=production npm start
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Pages     │  │  Components │  │   Hooks     │          │
│  │  (12 pages) │  │  (10+ UI)   │  │  (4 custom) │          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
│         │                │                │                  │
│  ┌──────┴────────────────┴────────────────┴──────┐          │
│  │              Context Providers                 │          │
│  │  (Auth, Notification, Socket)                 │          │
│  └────────────────────────┬──────────────────────┘          │
│                           │                                  │
│  ┌────────────────────────┴──────────────────────┐          │
│  │              API Service Layer                 │          │
│  │         (Centralized fetch wrapper)           │          │
│  └────────────────────────┬──────────────────────┘          │
└───────────────────────────┼──────────────────────────────────┘
                            │
                    HTTP / WebSocket
                            │
┌───────────────────────────┼──────────────────────────────────┐
│                        BACKEND                               │
│  ┌────────────────────────┴──────────────────────┐          │
│  │              Express + Socket.IO               │          │
│  └────────────────────────┬──────────────────────┘          │
│                           │                                  │
│  ┌──────────┐  ┌──────────┴───────┐  ┌──────────┐          │
│  │  Routes  │──│   Controllers    │──│Middleware│          │
│  │(6 groups)│  │  (Business Logic)│  │(Auth,Err)│          │
│  └──────────┘  └──────────┬───────┘  └──────────┘          │
│                           │                                  │
│  ┌────────────────────────┴──────────────────────┐          │
│  │              Mongoose Models                   │          │
│  │      (User, Product, Order, Chat)             │          │
│  └────────────────────────┬──────────────────────┘          │
└───────────────────────────┼──────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    │   MongoDB     │
                    │   Database    │
                    └───────────────┘
```

### Data Flow

1. **User Action** → React Component
2. **Component** → Calls API service or dispatches Redux action
3. **API Service** → Makes HTTP request with JWT token
4. **Express Server** → Routes to appropriate controller
5. **Controller** → Validates, processes, interacts with MongoDB
6. **Response** → Returns to frontend
7. **Context/Redux** → Updates state
8. **Component** → Re-renders with new data

### Real-Time Flow

1. **Client connects** → Socket.IO establishes WebSocket connection
2. **User action** (e.g., sends message) → API call to server
3. **Server** → Saves to database, emits Socket event
4. **All connected clients** → Receive event, update UI instantly

---

## 📝 License

MIT
