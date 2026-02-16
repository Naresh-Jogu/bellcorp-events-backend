# Event Management System – Backend (Server)

This is the backend API for the Event Management System, built using Node.js, Express, and MongoDB.

## The server handles authentication, event management, event registration, and dashboard data for users.

- Tech Stack

- Node.js

- Express.js

- MongoDB

- Mongoose

- JWT (JSON Web Token)

- bcrypt

- dotenv

- CORS

## Features

### Authentication

- User Registration

- User Login

- Password hashing using bcrypt

- JWT token generation

- Protected routes using middleware

## Event Management

- Create and store events in MongoDB

- Fetch all events with filtering:
  - Search (name)

  - Date

  - Location

  - Category

  - Get single event details

- Dynamic seat calculation:

```
Available Seats = capacity - registeredCount
```

## Event Registration

- Register user for an event

- Prevent duplicate registration

- Prevent registration when event is full

- Cancel registration

- Automatically update registeredCount

## Dashboard

- Fetch user’s registered events

- Separate past and upcoming events (handled in frontend)

## Project Structure

```
server/
│
├── models/
│   ├── User.js
│   └── Event.js
│
├── routes/
│   ├── authRoutes.js
│   └── eventRoutes.js
│
├── middleware/
│   └── authMiddleware.js
│
├── config/
│   └── db.js
│
├── .env
├── server.js
└── package.json
```

## Server will run at:

```
http://localhost:5000
```

## Authentication Flow

**User registers → password hashed using bcrypt**

**User logs in → password verified**

- Server generates JWT token

- Token returned to frontend

- Protected routes require:

## API Endpoints

### Auth Routes

```
 Method	       Endpoint                Description

 POST	       /api/auth/register	   Register new user
 POST	      /api/auth/login	       Login user
```

## Purpose

- **This backend was built to demonstrate:**

- **Secure authentication with JWT**

- **RESTful API design**

- **MongoDB data modeling**

- **Middleware-based route protection**

- **Real-world event registration logic**

- **Full-stack integration with React frontend**
