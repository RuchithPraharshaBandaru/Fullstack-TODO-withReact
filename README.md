# Todo List Application

A simple, secure, and responsive Todo List application built with the MERN stack (MongoDB, Express.js, React, Node.js) and styled with Tailwind CSS.

## Features

- User authentication (Register/Login)
- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- Responsive design
- Secure API endpoints with JWT authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Setup Instructions

1. Clone the repository
2. Install dependencies:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/todoapp
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

4. Start the application:

```bash
# Start the backend server (from the backend directory)
npm run dev

# Start the frontend (from the root directory)
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Technologies Used

- Frontend:
  - React
  - React Router DOM
  - Axios
  - Tailwind CSS

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - JSON Web Tokens (JWT)
  - bcryptjs

## Project Structure

```
todoapp/
├── src/                    # Frontend source files
│   ├── components/         # React components
│   ├── App.js             # Main App component
│   └── index.js           # Frontend entry point
├── backend/               # Backend source files
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── server.js         # Backend entry point
└── package.json          # Project dependencies
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Todos
- GET /api/todos - Get all todos for authenticated user
- POST /api/todos - Create a new todo
- PUT /api/todos/:id - Update a todo
- DELETE /api/todos/:id - Delete a todo 