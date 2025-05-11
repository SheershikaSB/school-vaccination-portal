# School Vaccination Portal

A full-stack web application to manage student vaccination records, built with React (Frontend), Node.js/Express (Backend), and PostgreSQL (Database). It supports individual student management, bulk import via CSV, and vaccination tracking.

## Features

* Add, edit, and delete student records
* Bulk upload students via CSV
* Vaccination status management
* Secure authentication and role-based access
* Search and filter students by ID, name, or vaccination status
* Interactive, responsive UI with elegant design
* Dockerized for easy deployment

## Prerequisites

* Docker & Docker Compose
* Node.js (v18+) and npm
* PostgreSQL

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/school-vaccination-portal.git
cd school-vaccination-portal
```

### 2. Configure Environment Variables

Create a `.env` file in the root of the project with the following contents:

```
# Backend Environment Variables
PORT=5000
DATABASE_URL=postgresql://postgres:yourpassword@db:5432/school_vaccination
JWT_SECRET=your_jwt_secret_key

# Frontend Environment Variables (create .env in /frontend)
REACT_APP_API_URL=http://localhost:5000/api
```



## Development

### Start Backend

```bash
cd backend
npm install
npm run dev
```

### Start Frontend

```bash
cd frontend
npm install
npm start
```


