<img width="1891" height="891" alt="image" src="https://github.com/user-attachments/assets/f1720787-6a30-46b8-bc2d-f8c0300102ec" /><img width="1891" height="891" alt="image" src="https://github.com/user-attachments/assets/f9fc0b07-b9d0-494f-bd93-e3879e064aab" /># Flight Booking System

A full-stack flight booking web application with user authentication, flight search, booking management, and admin flight controls.

## Live Deployment

- Backend: [https://tripzy-backend-j5t5.onrender.com](https://tripzy-backend-j5t5.onrender.com)
- Frontend: [https://tripzy-frontend-sb5l.onrender.com](https://tripzy-frontend-sb5l.onrender.com)

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, React Toastify
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- Tooling: ESLint, Nodemon

## Features

- User registration and login with JWT authentication
- Protected routes for signed-in users
- Role-based access control for admin pages and APIs
- View and search flights by source, destination, and date
- Book flights with passenger details and seat selection
- View your bookings and cancel bookings
- Auto ticket generation after successful booking
- Admin dashboard to add, edit, and delete flights

## Project Structure

```text
flight_booking_system/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── index.js
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── routes/
    │   └── services/
    └── package.json
```

## Prerequisites

- Node.js (v18 or newer recommended)
- npm
- MongoDB (local or Atlas)

## Environment Variables

### Backend (`backend/.env`)

Create a `.env` file inside `backend/`:

```env
PORT=5000
MONGO_URI=####
JWT_SECRET=####
CORS_ORIGINS=http://localhost:5173,https://tripzy-frontend-sb5l.onrender.com
```

Notes:
- `CORS_ORIGINS` accepts comma-separated origins for multiple frontend URLs.
- If `PORT` is not provided, backend uses `5000`.

### Frontend (`frontend/.env`)

Create a `.env` file inside `frontend/`:

```env
VITE_BASE_URL_BACKEND=http://localhost:5000/api
```

If not set, frontend defaults to the deployed backend URL in code.

## Installation

From the project root:

```bash
cd backend
npm install
cd ../frontend
npm install
```

## Run Locally

Use two terminals.

### 1) Start backend

```bash
cd backend
npm run dev
```

Backend runs on: `http://localhost:5000`

### 2) Start frontend

```bash
cd frontend
npm run dev
```

Frontend runs on: `http://localhost:5173`

## API Overview

Base URL: `http://localhost:5000/api`

Production Base URL: `https://tripzy-backend-j5t5.onrender.com/api`

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Users

- `GET /users/profile` (protected)

### Flights

- `GET /flights` (public)
- `GET /flights/search` (public)
- `GET /flights/:id` (public)
- `POST /flights` (admin)
- `PUT /flights/:id` (admin)
- `DELETE /flights/:id` (admin)

### Bookings

- `POST /bookings` (protected)
- `GET /bookings/my` (protected)
- `PATCH /bookings/:id/cancel` (protected)

## Frontend Routes

- `/` Home
- `/login` Login
- `/register` Register
- `/about` About
- `/flights` Protected flights list
- `/book` Protected booking page
- `/my-bookings` Protected booking history
- `/profile` Protected user profile
- `/admin` Admin dashboard
- `/admin/add-flight` Admin add flight form
- `/admin/edit-flight/:id` Admin edit flight form

## Dashboard Screenshot
<img width="1888" height="886" alt="image" src="https://github.com/user-attachments/assets/5c1ddc6d-7950-46e5-9357-31eccde909a4" />

## Flights and Booking Screenshot
<img width="1891" height="891" alt="image" src="https://github.com/user-attachments/assets/5b96ef00-bfbc-4f80-9d83-734b716bc35b" />

<img width="1892" height="877" alt="image" src="https://github.com/user-attachments/assets/778a342c-6ae7-43c2-9126-9815dd0c633e" />

<img width="1892" height="767" alt="image" src="https://github.com/user-attachments/assets/bcd14348-d05c-47dc-be86-998078064e66" />

## Admin dashboard Screenshot
<img width="1883" height="887" alt="image" src="https://github.com/user-attachments/assets/c6cc0a1a-3050-408c-9bd5-60bc981c39ff" />

<img width="1890" height="887" alt="image" src="https://github.com/user-attachments/assets/59d4f430-faab-4689-aa18-519ca50cc063" />

<img width="1895" height="897" alt="image" src="https://github.com/user-attachments/assets/065f3e13-2da8-4d3b-a41b-460300053181" />


## Admin Access

Admin role is currently assigned in backend registration logic for:

- `admin@gmail.com`

Register with this email to access admin pages and admin APIs.

## Common Scripts

### Backend

- `npm run dev` - Start backend with nodemon

### Frontend

- `npm run dev` - Start Vite dev server
- `npm run build` - Create production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Troubleshooting

- If backend fails to start, verify `MONGO_URI` and `JWT_SECRET`.
- If frontend cannot call backend, verify `VITE_BASE_URL_BACKEND`.
- If CORS errors occur, ensure frontend URL is listed in `CORS_ORIGINS`.
- If protected requests fail, clear local storage and login again.

## Future Improvements

- Add tests (unit/integration/e2e)
- Add booking payment flow
- Add seat-map UI with real-time locking
- Add Docker and CI/CD setup
- Add refresh token flow and stronger role management
