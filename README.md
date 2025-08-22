# Ticco - Time Tracking Made Easy

Ticco is a modern time tracking application designed to help individuals and teams efficiently track their time across different activities. With real-time synchronization across devices, a clean intuitive interface, and powerful reporting features, Ticco helps you understand where your time goes.

🌐 **Website**: [www.ticco.app](https://www.ticco.app) (Coming Soon)

## Features

### ⏱️ Time Tracking

- Start and stop timers with a single click
- Assign activities to your time entries
- Real-time synchronization across all your devices

### 🎨 Customizable Activities

- Create personal activities with custom colors and icons
- Choose from a library of pre-defined global activities
- Organize your time entries by activity type

### 📊 Analytics and Reporting

- View your time distribution by activity
- Filter timesheets by date ranges and activities
- Export your time data for further analysis

### 🔄 Real-time Sync

- WebSocket-based real-time updates across devices
- Get instant updates when timesheets change

## Tech Stack

### Frontend

- **React** with TypeScript
- **Vite** for fast development and optimized builds
- **TanStack Query** for efficient data fetching and caching
- **Socket.io Client** for real-time updates
- **Shadcn UI** for modern, accessible components
- **Tailwind CSS** for styling

### Backend

- **Node.js** with Express
- **TypeORM** for database interactions
- **Socket.io** for WebSocket connections
- **MySQL** database for data storage
- **Redis** for socket.io adapter and session management
- **JWT** for authentication
- **Nodemailer** for email notifications

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MySQL database (or Docker for containerized setup)

### Frontend Setup

1. Clone the repository

   ```bash
   git clone https://github.com/mena7akim/Ticco.git
   cd Ticco/frontend
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables

   ```
   # Create a .env file with these variables
   VITE_API_URL=http://localhost:8000  # Backend API URL with port
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Backend Setup

1. Navigate to the backend directory

   ```bash
   cd ../backend
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables

   ```
   # Create a .env file with these variables
   # Database Configuration
   DB_HOST=localhost        # Use 'db' for Docker setup
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=password
   DB_NAME=ticco            # Database name
   DB_SYNCHRONIZE=true      # Auto-create database schema (set to false in production)
   DB_LOGGING=true          # Log database queries

   # Authentication
   JWT_SECRET=your_secure_secret_key
   JWT_EXPIRATION=1d        # Token expiration time

   # CORS Configuration
   CORS_ORIGIN=http://localhost:5173  # Frontend URL

   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=true
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_email_app_password

   # Redis Configuration (for socket.io)
   REDIS_HOST=localhost     # Use 'redis' for Docker setup
   REDIS_PORT=6379
   REDIS_PASSWORD=redis-password

   # Environment
   NODE_ENV=development
   PORT=8000                # API server port
   ```

4. Initialize the database

   ```bash
   # No separate command needed - database schema will be
   # automatically created if DB_SYNCHRONIZE=true is set in .env
   ```

5. Start the backend server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Docker Setup (Backend)

1. Make sure you have Docker and Docker Compose installed on your machine

2. Navigate to the backend directory

   ```bash
   cd backend
   ```

3. Create a .env file with environment variables

   ```
   # Use the same variables as above but with these changes:
   DB_HOST=db              # Reference the service name in docker-compose
   REDIS_HOST=redis        # Reference the service name in docker-compose
   ```

4. Build and start the containers

   ```bash
   docker-compose up -d
   ```

   This will start:

   - MySQL database container
   - Redis container for socket.io
   - Node.js backend container
   - Adminer for database management (accessible at http://localhost:8080)

5. To stop the containers

   ```bash
   docker-compose down
   ```

6. To view logs
   ```bash
   docker-compose logs -f
   ```

## Application Structure

### Frontend

```
frontend/
├── public/           # Static assets
├── src/
│   ├── assets/       # Images and other assets
│   ├── components/   # Reusable UI components
│   │   ├── activities/   # Activity-related components
│   │   ├── timesheets/   # Timesheet-related components
│   │   └── ui/           # Base UI components
│   ├── contexts/     # React contexts
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utilities and helpers
│   ├── pages/        # Page components
│   │   └── tabs/         # Tab pages
│   ├── services/     # API service functions
│   ├── store/        # State management
│   └── types/        # TypeScript type definitions
```

### Backend

```
backend/
├── init.sql/         # Database initialization
├── src/
│   ├── middleware/   # Express middleware
│   ├── models/       # Database models
│   ├── modules/      # Feature modules
│   ├── repository/   # Data access layer
│   ├── utils/        # Utilities
│   │   ├── sockets/      # WebSocket handlers
│   │   └── ...
│   └── validation/   # Request validation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Special thanks to all contributors who have helped make Ticco better
- Inspiration from popular time tracking solutions while focusing on simplicity and real-time capabilities

---

Developed by [Mena Hakim](https://github.com/mena7akim) | [www.ticco.app](https://www.ticco.app) (Coming Soon)
