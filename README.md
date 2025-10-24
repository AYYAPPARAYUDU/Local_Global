---

## 🚀 Live Demo

Our full-stack application is live and deployed on the internet. You can test the "live location" features, real-time chat, and the complete checkout process right now.

**Live Website URL:** **[https://local-global.vercel.app/](https://local-global.vercel.app/)**

---





### For Customers:
* **Live Location Filtering:** Automatically finds products from shops nearest to the customer and sorts them by distance (e.g., "5.2 km away").
* **Advanced Real-time Chat:** Start a live chat with any shopkeeper about a specific product.
* **Multi-Step Checkout:** A professional 3-step UI (Shipping $\rightarrow$ Payment Method $\rightarrow$ Pay).
* **Real UPI Payments:** Dynamically generates a scannable QR code based on the shopkeeper's real `upiId` and the exact order total.
* **Secure Payment Flow:** Requires the customer to enter their UTR/Transaction ID to confirm payment before the order is placed.
* **Order Management:** View a complete order history (`/my-orders`).
* **Cancel Order:** Customers can cancel their own orders if the status is still "Processing."
* **Product Reviews:** Leave star ratings and comments on products.
* **Shopping Cart:** A fully persistent shopping cart.

### For Shopkeepers:
* **Advanced Analytics Dashboard:** View real-time stats like Total Revenue, Total Orders, and see charts for Weekly Sales and Sales by Category.
* **Product Management (CRUD):** A full dashboard to Add, Edit, and Delete products.
* **Image Uploads:** Upload product images directly to the **Cloudinary** cloud.
* **Advanced Order Management:** A "real-world" workflow to view incoming orders, mark them as "Shipped" (by adding a tracking number), and "Delivered."
* **Shop Settings:** A complete settings page to update shop name, description, return policy, and **UPI ID** for payments.
* **Live Location Setting:** A "Location" tab with an interactive map where shopkeepers can pin their exact store location.
* **Live Chat:** Receive and reply to all customer messages in real-time from the dashboard.

## Tech Stack

This project uses a modern, full-stack MERN architecture.

* **Frontend:**
    * **React 18** (with Vite)
    * **React Router v6** (for routing)
    * **Framer Motion** (for all page animations)
    * **Axios** (for API requests)
    * **Socket.IO Client** (for real-time chat)
    * **Leaflet.js** (for interactive maps)

* **Backend:**
    * **Node.js**
    * **Express.js** (for the REST API)
    * **MongoDB** (with Mongoose)
    * **Socket.IO** (for real-time chat server)
    * **JSON Web Tokens (JWT)** (for secure authentication)
    * **bcrypt.js** (for password hashing)
    * **Cloudinary** (for cloud-based image storage)
    * **Multer** (for handling image uploads)

* **Database:**
    * **MongoDB Atlas** (Cloud-hosted database)

## Getting Started

To run this project on your local machine, you will need to run both the `server` and the `Client` in two separate terminals.

### 1. Backend (Server)

```bash
# 1. Navigate to the server folder
cd server

# 2. Install all dependencies
npm install

# 3. Create a .env file
# Create a new file named .env in the /server folder and add the following variables:
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# 4. Run the server
npm run dev

2. Frontend (Client)
Bash

# 1. Open a new terminal and navigate to the Client folder
cd Client

# 2. Install all dependencies
npm install

# 3. Create a .env file
# Create a new file named .env in the /Client folder and add the following:
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# 4. Run the frontend app
npm run dev


Folder Structure
The project is split into two main folders:

/Local_Global
│
├── /Client
│ ├── /src
│ │ ├── /components  (Reusable components like Card, Chat, Map)
│ │ ├── /context     (AuthContext, CartContext, LocationContext)
│ │ ├── /hooks       (useAuth)
│ │ ├── /pages       (All main pages: Home, Products, Checkout)
│ │ └── /dashboard   (All shopkeeper pages: Dashboard, Orders, Analytics)
│ ├── public/
│ └── package.json
│
└── /server
  ├── /controllers (The "brains" of the API logic)
  ├── /middleware  (Security and upload logic)
  ├── /models      (Database blueprints/schemas)
  ├── /routes      (All API endpoints)
  ├── /sockets     (Socket.IO chat logic)
  ├── .env         (Your secret keys)
  ├── server.js    (The main server file)
  └── package.json
