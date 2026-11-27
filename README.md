# AgroChain – Smart Agriculture Marketplace

A full-stack agricultural marketplace connecting farmers, suppliers, and buyers through a centralized digital platform.

**Live Application:** https://agrochain-smart-agriculture-marketplace.onrender.com

**GitHub Repository:** https://github.com/akshaykrishnansub/agrochain-smart-agriculture-marketplace

---

## 1. Project Overview

AgroChain is a Smart Agriculture Marketplace designed to simplify agricultural product discovery, purchasing, and management.

The platform provides dedicated functionality for farmers, suppliers, buyers, and administrators. Farmers and suppliers can manage product listings, buyers can browse products and place orders, and administrators can oversee platform activities through a centralized dashboard.

The application also incorporates payment processing, certification management, notifications, caching, and cloud-based file storage.

## 2. Key Features

### Authentication and User Management
- User registration and login.
- JWT-based authentication.
- Secure password hashing using bcrypt.
- HTTP-only cookie-based authentication.
- Role-based access control.
- Dedicated functionality based on user roles.
- User profile management.

### Farmer and Supplier Features
- Create and manage product listings.
- Upload product images.
- Update product information and availability.
- Manage product stock.
- Upload certification documents.
- View and manage incoming orders.

### Buyer Features
- Browse available agricultural products.
- Search and filter products.
- View product details.
- Add products to the purchasing flow.
- Place orders.
- Complete payments through Stripe Checkout.
- View order information and payment status.

### Order and Payment Management
- Order creation and management.
- Order status tracking.
- Payment status tracking.
- Stripe Checkout integration.
- Stripe webhook integration for payment event handling.

### Certification Management
- Upload certification documents.
- Associate certifications with users or products.
- Administrator review of submitted certifications.
- Approve or reject certification requests.
- Track certification review status.

### Admin Dashboard
- Dashboard analytics and statistics.
- User management.
- View and manage user roles.
- Product management.
- Order management.
- Certification review and approval.
- Administrative oversight of marketplace activities.

### Notifications
- Real-time notifications using Socket.IO.
- Notification management.
- Toast notifications for application feedback.

### Performance and Storage
- Redis-based caching.
- MongoDB for persistent application data.
- AWS S3 for file and image storage.

---

### Screenshots
### 1. Home Page
<img width="1920" height="1080" alt="Screenshot (409)" src="https://github.com/user-attachments/assets/d8853927-ec66-446d-b4eb-ff08f1a66f41" />
### 2. Marketplace
<img width="1920" height="1080" alt="Screenshot (410)" src="https://github.com/user-attachments/assets/5f9f8978-5ff2-407b-9e6d-a3be122c9a1c" />
### 3. Admin Dashboard
<img width="1920" height="1080" alt="Screenshot (411)" src="https://github.com/user-attachments/assets/c94741b4-db9f-4022-b135-968ccce1d365" />
### 4. Order Management
<img width="1920" height="1080" alt="Screenshot (412)" src="https://github.com/user-attachments/assets/759d0819-4b2d-440c-822c-6392a367b006" />
### 5. Notifications
<img width="1920" height="1080" alt="Screenshot (413)" src="https://github.com/user-attachments/assets/e6eb7ae5-ee99-45d6-8902-e22e5aec5cfe" />

## 3. Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS |
| Routing | React Router |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB, Mongoose |
| Caching | Redis, ioredis |
| Authentication | JWT, bcrypt, HTTP-only cookies |
| Real-time Communication | Socket.IO |
| File Storage | AWS S3 |
| Payments | Stripe Checkout, Stripe Webhooks |
| Containerization | Docker |
| CI/CD | GitHub Actions |
| Container Registry | GitHub Container Registry (GHCR) |
| Deployment | Render |
| API Testing | Postman |
| Version Control | Git, GitHub |

---

## 4. Application Architecture

AgroChain follows a client-server architecture.

### Frontend
The React application provides the user interface and communicates with the backend through HTTP requests. It handles navigation, authentication state, product browsing, order management, and role-specific dashboards.

### Backend
The Express.js application exposes REST APIs for authentication, users, products, orders, payments, certifications, and administrative operations.

The backend follows a structured organization of routes, controllers, services, models, and middleware.

### Database
MongoDB stores application data, including:
- Users
- Products
- Orders
- Certifications
- Notifications

Mongoose is used for schema definition, data validation, and database operations.

### Caching
Redis is used to cache frequently accessed data and reduce repeated database queries.

### File Storage
AWS S3 is used to store uploaded files, including product images and certification documents.

### Payment Processing
Stripe Checkout handles payment sessions. Stripe webhooks communicate payment events back to the backend so that order and payment statuses can be updated.

### Real-time Communication
Socket.IO enables real-time notification delivery between the backend and connected clients.

---

## 5. Project Structure

The repository is organized into separate frontend and backend applications.

```text
agrochain-smart-agriculture-marketplace/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── seed/
│   │
│   ├── package.json
│   └── ...
│
├── .github/
│   └── workflows/
│       └── docker-publish.yml
│
├── Dockerfile
├── .dockerignore
└── README.md
```

---

## 6. Getting Started

Follow these instructions to run AgroChain locally.

### Prerequisites

Ensure the following tools and services are available:

- Node.js
- npm
- MongoDB Atlas account or a local MongoDB instance
- Redis instance
- AWS account with an S3 bucket
- Stripe account for test payments
- Git
- Docker (optional, for containerized execution)

### Clone the Repository

```bash
git clone https://github.com/akshaykrishnansub/agrochain-smart-agriculture-marketplace.git

cd agrochain-smart-agriculture-marketplace
```

### Backend Setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory and configure the required environment variables.

Build the backend:

```bash
npm run build
```

Start the backend in development mode:

```bash
npm run dev
```

The backend runs on the configured port. For local development, the default application port is 5000.

### Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Configure the frontend environment files according to the frontend configuration.

Start the development server:

```bash
npm run dev
```

The frontend development server runs on the Vite-configured port.

---

## 7. Environment Variables

The application requires environment variables for database connectivity, authentication, caching, file storage, payments, and frontend-backend communication.

### Backend Environment Variables

Create `backend/.env`:

```env
NODE_ENV=development

PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

REDIS_URL=your_redis_connection_url

FRONTEND_URL=http://localhost:5173

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_s3_bucket_name

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_signing_secret
```

Use the appropriate values for your own environment.

### Frontend Environment Variables

Configure the frontend environment files according to the API URL variable used in the frontend configuration.

Do not commit actual environment files or credentials to GitHub.

**Important:** The environment variable names above should be checked against the current application configuration before use.

---

## 8. Database Seeding

AgroChain includes a seed script for creating initial administrator, farmer, and supplier accounts.

The script:
- Connects to MongoDB using the configured connection string.
- Reads account details from environment variables.
- Hashes passwords using bcrypt.
- Checks whether an account already exists before creating it.
- Skips existing accounts instead of overwriting their credentials.

Configure the following variables in `backend/.env`:

```env
SEED_ADMIN_NAME=
SEED_ADMIN_EMAIL=
SEED_ADMIN_PASSWORD=

SEED_FARMER_NAME=
SEED_FARMER_EMAIL=
SEED_FARMER_PASSWORD=

SEED_SUPPLIER_NAME=
SEED_SUPPLIER_EMAIL=
SEED_SUPPLIER_PASSWORD=
```

Run the seed script manually from the backend directory:

```bash
npm run seed
```

The script is not executed automatically when the application starts.

Never commit seed credentials or production passwords to the repository.

---

## 9. Stripe Payment Integration

AgroChain integrates Stripe Checkout for payment processing.

The payment workflow includes:

1. The buyer initiates checkout.
2. The backend creates a Stripe Checkout session.
3. The buyer is redirected to the Stripe-hosted checkout page.
4. Stripe processes the payment.
5. Stripe sends webhook events to the backend.
6. The backend updates the corresponding order and payment statuses.

The application uses the following Stripe webhook events:

- `checkout.session.completed`
- `checkout.session.expired`

### Payment Testing

The deployed application currently uses **Stripe Test Mode**.

Use Stripe's official test card details when testing payments:

```text
Card Number: 4242 4242 4242 4242
Expiry Date: Any future date
CVC: Any three digits
```

No real payments are processed in test mode.

For local development, Stripe CLI can be used to forward webhook events to the local backend.

For the deployed application, webhook events are configured through the Stripe Dashboard.

---

## 10. Docker

AgroChain uses Docker to package the application into a container image.

The root-level Dockerfile builds the frontend and backend and packages them for deployment.

The Express server serves the built frontend application in production.

Build the Docker image from the repository root:

```bash
docker build -t agrochain .
```

Run the container with the required environment variables configured:

```bash
docker run -p 5000:5000 --env-file backend/.env agrochain
```

Ensure the environment configuration is appropriate for the container environment.

---

## 11. CI/CD Pipeline

AgroChain uses GitHub Actions to automate Docker image building, publishing, and deployment.

The workflow is configured in:

```text
.github/workflows/docker-publish.yml
```

### Pipeline Workflow

1. A code change is pushed to the `main` branch.
2. GitHub Actions starts the workflow.
3. The repository is checked out.
4. Docker Buildx is configured.
5. The workflow authenticates with GitHub Container Registry.
6. A Docker image is built.
7. The image is published to GHCR with `latest` and commit SHA tags.
8. The workflow triggers a Render deployment using the newly published image.

### Deployment Flow

```text
Developer
    |
    v
GitHub Repository
    |
    v
GitHub Actions
    |
    v
Docker Image Build
    |
    v
GitHub Container Registry
    |
    v
Render Deployment
    |
    v
Live AgroChain Application
```

The deployment workflow uses GitHub repository secrets for sensitive deployment configuration.

---

## 12. Deployment

The application is deployed on Render.

**Live URL:**

https://agrochain-smart-agriculture-marketplace.onrender.com

The deployed application uses:

- Render for application hosting.
- MongoDB Atlas for database storage.
- Render Key Value (Valkey) for Redis-compatible caching.
- AWS S3 for file storage.
- Stripe Test Mode for payment processing.
- GitHub Container Registry for Docker image storage.
- GitHub Actions for automated builds and deployments.

Production environment variables are configured through the Render dashboard.

---

## 13. Security Considerations

The application incorporates the following security measures:

- Password hashing using bcrypt.
- JWT-based authentication.
- HTTP-only authentication cookies.
- Role-based access control.
- Environment-based configuration for sensitive credentials.
- Server-side validation and authorization.
- Stripe webhook-based payment event handling.

Never commit `.env` files, database credentials, AWS secrets, JWT secrets, or Stripe secret keys to the repository.

---

## 14. Future Enhancements

Potential areas for further development include:

- Production payment activation and configuration.
- Enhanced marketplace analytics.
- Additional search and discovery capabilities.
- Further performance optimization.
- Expanded automated testing and monitoring.

---

## 15. Author

**Akshay Krishnan**

Full Stack Developer

**Project:** AgroChain – Smart Agriculture Marketplace

**GitHub:** https://github.com/akshaykrishnansub

---

## 16. License

This project is currently intended as a portfolio and internship project.

Add an appropriate open-source license if you decide to distribute the source code under specific reuse permissions.
