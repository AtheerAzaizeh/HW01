# BLAKV. | Premium Hoodies Store

This project is a modern, responsive React application built for a streetwear brand named **BLAKV**. It demonstrates the use of React Hooks, Material UI (MUI), and API integration as part of a university assignment.

## 🚀 Project Overview

The website allows users to:
1.  **Browse Products:** View a curated collection of local hoodie products (managed via state).
2.  **Order Custom Designs:** Submit a request for bulk or custom orders with form validation.
3.  **View External Inventory:** Fetch and display real-time product data from a public API.

## 📂 Requirement Mapping (HW #2 Update)

### Part 1: Routing (React Router)
The application uses `react-router-dom` to handle navigation without page reloads.
- **Routes**:
    - `/` -> **Home Page**
    - `/contact` -> **Form Page**
    - `/api` -> **External Data Page**
    - `*` -> **404 Not Found Page** (Handles unknown URLs)

### Part 2: Global State (Context API)
A `CartContext` has been implemented to share shopping cart data across components.
- **What it stores**: An array of product objects acting as the "Cart".
- **How it's used**:
    - **`CartContext.jsx`**: Provides `addToCart` and `getCartCount` functions.
    - **`Navbar.jsx`**: Consumes context to display real-time number of items in the cart (red badge).
    - **`Home.jsx`**: Uses `addToCart` to add featured products to the global state.
    - **`ExternalData.jsx`**: Uses `addToCart` to add API-fetched products to the global state.

## 🛠 Tech Stack

* **Framework:** React + Vite
* **Styling:** Material UI (MUI) & Emotion
* **Routing:** React Router DOM
* **Icons:** MUI Icons Material

## How to Run

Follow these steps to set up the project locally:

1.  **Install Dependencies:**
    Open your terminal in the project folder and run:
    ```bash
    npm install
    ```

2.  **Start the Development Server:**
    Run the following command to start the app:
    ```bash
    npm run dev
    ```

3.  **Open in Browser:**
    Click the link shown in the terminal (usually `http://localhost:5173`).

---

### Developer Notes
* **Architecture:** The project uses a Clean Architecture approach, separating `components` (reusable UI) from `pages` (views).
* **Theme:** A custom MUI theme (`src/theme.js`) controls the dark mode, typography, and gold accent colors globally.