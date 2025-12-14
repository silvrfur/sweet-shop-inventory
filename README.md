# Sweet Shop Management System

## 1. Project Overview

The Sweet Shop Management System is a full-stack web application designed to manage the sale and inventory of traditional sweets. The system supports role-based access, allowing customers to browse and purchase sweets while administrators manage inventory through secure controls.

The project demonstrates:
- Full-stack application development
- Secure authentication and authorization
- Role-based access control
- RESTful API integration
- Modern frontend UI/UX practices

The application consists of:
- A Single Page Application (SPA) frontend built with React
- A Flask-based backend API
- MongoDB for data persistence, managed via Docker

---

## 2. Features

### User Features
- User registration and login
- View all available sweets
- Search and filter sweets
- Purchase sweets
- Purchase button disabled when stock is unavailable

### Admin Features
- All user features
- Add new sweets
- Update sweet details
- Delete sweets
- Restock inventory
- Admin-only routes and UI controls

### Security Features
- JWT-based authentication
- Role-based authorization (User and Admin)
- Protected frontend routes
- Backend-enforced access control

---

## 3. Technology Stack

### Frontend
- React (Vite)
- JavaScript (ES6+)
- Tailwind CSS
- shadcn/ui
- React Router DOM

### Backend
- Python (Flask)
- MongoDB
- Flask-JWT-Extended
- Docker and Docker Compose

---

## 4. Project Structure

```

SweetShopManagementSystem/
├── backend/
│   ├── app/
│   ├── run.py
│   ├── requirements.txt
│   └── venv/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── screenshots/
│   ├── login.png
│   ├── register.png
│   ├── dashboard.png
│   ├── admin-dashboard.png
│   └── inventory.png
│
├── docker-compose.yml
├── .gitignore
└── README.md

````

---

## 5. Setup and Run Instructions

### 5.1 Prerequisites

- Python 3.10 or higher
- Node.js (v18 or higher)
- Docker Desktop
- npm

---

### 5.2 Start Database Containers (Mandatory First Step)

The project uses MongoDB and Mongo Express via Docker.

#### If containers are NOT created yet

From the **project root directory**:

```bash
docker-compose up -d
````

This will create and start the required containers.

#### If containers are ALREADY created

Start them using:

```bash
docker start <container_name_or_id>
```

Example:

```bash
docker start mongodb
docker start mongo-express
```

Verify containers are running:

```bash
docker ps
```

---

### 5.3 Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create and activate a virtual environment:

**Windows (PowerShell):**

```bash
python -m venv venv
.\venv\Scripts\Activate.ps1
```

3. Install backend dependencies:

```bash
pip install -r requirements.txt
```

4. Start the backend server:

```bash
python -m run
```

The backend API will run at:

```
http://127.0.0.1:5000
```

---

### 5.4 Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install frontend dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm run dev
```

The frontend application will run at:

```
http://localhost:5173
```

---

## 6. Screenshots

Screenshots of the final application are already added in the `screenshots/` folder.

These include:

* Login page
* Registration page
* User dashboard (sweets listing)
* Purchase flow with disabled button for out-of-stock items
* Admin inventory dashboard
* Sweet management interface (add, restock, delete)

---

## 7. My AI Usage

This project was developed with assistance from AI tools. All architectural decisions, logic validation, and final implementation choices were reviewed and understood by the developer.

### AI Tools Used

* **Vercel v0**
  Used for UI design recommendations.

* **ChatGPT 5.2**
  Used to debug code.

* **Cursor (GPT-4.1)**
  Used to debug React components.

AI tools were used as development assistants and not as autonomous code generators.

---

## 8. Design Considerations

* A single unified UI is used for both users and admins, with additional controls visible only to admins.
* Frontend role checks enhance user experience, while backend authorization remains the source of truth.
* The architecture is modular, scalable, and easy to extend.

---

## 9. Future Enhancements

* Order history for users
* Low-stock alerts
* Image upload for sweets
* Advanced filtering and sorting
* Production deployment

---

## 10. Conclusion

The Sweet Shop Management System demonstrates a complete full-stack solution with secure authentication, role-based access control, and a modern, responsive frontend. The project reflects real-world system design principles and best practices in modern web development.
