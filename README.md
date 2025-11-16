# MediGo 🏥

**AI-Powered Medical Appointment Booking Platform**

MediGo is a comprehensive healthcare management system that connects patients with trusted doctors through an intelligent, user-friendly platform. Built with cutting-edge AI technology, MediGo helps users get preliminary diagnoses and find the right medical specialists.

## ✨ Features

### 🤖 AI-Powered Symptom Checker
- **Intelligent Diagnosis**: Get AI-powered preliminary diagnosis using Groq's advanced language models
- **Specialist Recommendations**: Automatically suggests the right medical specialization
- **Doctor Matching**: Finds and displays matching doctors from the database
- **Confidence Levels**: Provides High/Medium/Low confidence ratings for diagnoses

### 👨‍⚕️ Doctor Management
- Browse doctors by specialization
- View doctor profiles, experience, and availability
- Book appointments with preferred doctors
- Real-time appointment scheduling

### 👤 User Features
- Complete user registration with profile information
- Secure authentication system
- Profile management (phone, address, gender, birthday)
- Appointment history and management
- Easy appointment cancellation

### 🔐 Admin Panel
- Add and manage doctors
- View all appointments
- Dashboard with analytics
- Doctor availability management

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - API calls
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Groq SDK** - AI integration
- **Cloudinary** - Image storage

### AI Integration
- **Groq API** - AI diagnosis engine
- **Model**: llama-3.1-8b-instant

## 📁 Project Structure

```
MediGo/
├── backend/
│   ├── config/          # Database & Cloudinary config
│   ├── controllers/      # Route controllers
│   ├── middlewares/     # Auth & upload middlewares
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # AI services
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/      # Page components
│   │   ├── context/    # Context providers
│   │   └── assets/     # Images & icons
│   └── vite.config.js
└── admin/               # Admin panel
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- Groq API key
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/MediGo.git
cd MediGo
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
AI_API_KEY=your_groq_api_key
AI_MODEL=llama-3.1-8b-instant
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=your_admin_password
```

Start backend:
```bash
npm run server
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_BACKEND_URL=http://localhost:4000
```

Start frontend:
```bash
npm run dev
```

4. **Admin Panel Setup**
```bash
cd admin
npm install
npm run dev
```

## 🌐 API Endpoints

### AI Endpoints
- `POST /api/ai/diagnose` - AI symptom diagnosis

### User Endpoints
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/get-profile` - Get user profile
- `POST /api/user/update-profile` - Update profile
- `POST /api/user/book-appointment` - Book appointment
- `GET /api/user/list-appointment` - List appointments
- `POST /api/user/cancel-appointment` - Cancel appointment

### Doctor Endpoints
- `GET /api/doctor/list` - List all doctors

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `POST /api/admin/add-doctor` - Add doctor
- `GET /api/admin/all-doctors` - Get all doctors
- `GET /api/admin/appointments` - Get all appointments

## 🔒 Environment Variables

### Backend
- `PORT` - Server port (default: 4000)
- `MONGODB_URI` - MongoDB connection string
- `AI_API_KEY` - Groq API key
- `AI_MODEL` - AI model name
- `JWT_SECRET` - JWT secret key
- `ADMIN_EMAIL` - Admin email
- `ADMIN_PASSWORD` - Admin password

### Frontend
- `VITE_BACKEND_URL` - Backend API URL

## 📱 Features in Detail

### AI Symptom Checker
1. User describes symptoms in natural language
2. AI analyzes symptoms using Groq API
3. Returns:
   - Condition name
   - Recommended specialization
   - Medical advice
   - Confidence level
4. System matches and displays relevant doctors

### Specializations Supported
- General Physician
- Cardiologist
- Dermatologist
- ENT
- Gastroenterologist
- Ophthalmologist
- Endocrinologist
- Orthopedic
- Neurologist
- Gynecologist
- Pediatricians

## 🚢 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Quick Deploy Options:
- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Render, Heroku
- **Database**: MongoDB Atlas

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**MediGo Development Team**

## 🙏 Acknowledgments

- Groq for AI API
- MongoDB Atlas for database hosting
- All open-source contributors

---

**Made with ❤️ for better healthcare access**
