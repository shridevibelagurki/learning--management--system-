# 📚Learning Management System (LMS) with AI Chatbot

A full-stack **Learning Management System (LMS)** integrated with an **AI-powered chatbot** to enhance digital learning experiences. This application enables efficient course management, user interaction, and intelligent assistance for learners.

---

## 🚀 Features

* Course management (create, update, delete, view)
* User authentication and session handling
* AI chatbot for real-time assistance
* Responsive and modern UI
* RESTful API architecture

---

##  Tech Stack

* **Frontend:** Next.js, React
* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **AI Integration:** Hugging Face API

---

## 📁 Project Structure

```
lms-project-with-ai/
├── backend/      # API and database logic
├── frontend/     # Next.js client application
├── server.js     # AI chatbot server
├── package.json
└── .gitignore
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```
git clone https://github.com/your-username/learning--management--system-.git
cd learning--management--system-
```

### 2. Install Dependencies

```
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` folder:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=lms_db
HUGGINGFACE_API_KEY=your_api_key
```

### 4. Setup Database

```
CREATE DATABASE lms_db;
```

### 5. Run the Application

**Backend:**

```
cd backend
npm run dev
```

**Frontend + AI Server:**

```
npm run dev
```

---

## 🌐 Application Access

* Frontend: http://localhost:3000
* Backend API: http://localhost:5000
* AI Chat Server: http://localhost:5001

---

## Security Notes

* Do not commit `.env` files
* Keep API keys secure
* Use `.env.example` for sharing configuration

---

## License

This project is licensed under the MIT License.

---

##  Author

**Shridevi Belagurki**

---

⭐ If you found this project useful, consider giving it a star on GitHub.
