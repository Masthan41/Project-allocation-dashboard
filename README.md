# MERN Project Enrollment & Allocation System

A comprehensive project enrollment and allocation system built with the MERN stack, featuring real-time notifications, admin management, and team collaboration tools.

## 🚀 Features

### User Features
- **Project Applications**: Apply for available projects with motivation and experience details
- **Status Tracking**: Real-time tracking of application status (pending/approved/rejected)
- **Batch Management**: Automatic assignment to project batches after approval
- **Profile Management**: Complete user profile with skills, experience, and bio
- **Notifications**: Real-time notifications for approvals, rejections, and updates
- **Dashboard**: Comprehensive overview of applications, projects, and team status

### Admin Features
- **Application Management**: Review and approve/reject user applications
- **Project Management**: Create, update, and manage project listings
- **Batch Allocation**: Organize approved users into project batches
- **Progress Tracking**: Monitor ongoing project progress and team performance
- **User Management**: Assign roles and manage user permissions
- **Analytics Dashboard**: Comprehensive overview of system metrics

### Technical Features
- **Real-time Updates**: Socket.io integration for instant notifications
- **Responsive Design**: Mobile-first design with beautiful UI/UX
- **Role-based Access**: Secure authentication and authorization
- **RESTful API**: Well-structured backend API with proper error handling
- **Database Integration**: MongoDB with Mongoose ODM
- **Production Ready**: Optimized for deployment and scalability

## 🏗 Architecture

### Backend (Node.js + Express)
```
backend/
├── controllers/     # Business logic and request handling
├── models/         # Database models and schemas
├── routes/         # API routes and endpoints
├── middleware/     # Authentication and validation middleware
├── config/         # Database and app configuration
└── server.js       # Main server file
```

### Frontend (React + TypeScript)
```
frontend/
├── src/
│   ├── components/  # Reusable UI components
│   ├── pages/      # Page components
│   ├── context/    # React Context for state management
│   ├── services/   # API service functions
│   ├── types/      # TypeScript type definitions
│   └── utils/      # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB connection string
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/enrollment_system
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

## 📊 Database Schema

### Models
- **User**: User profiles with authentication and role management
- **Project**: Project listings with requirements and specifications
- **Application**: User applications for projects with status tracking
- **Batch**: Project teams with member management and progress tracking
- **Notification**: Real-time notifications system

## 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (User/Admin)
- Protected routes and API endpoints
- Secure password hashing with bcrypt

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Interactive Components**: Smooth animations and hover effects
- **Status Indicators**: Visual badges for application and project status
- **Real-time Updates**: Live notifications and status changes
- **Dark Mode Support**: Coming soon

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project (Admin)
- `PUT /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)

### Applications
- `POST /api/applications` - Submit application
- `GET /api/applications/my` - Get user's applications
- `GET /api/applications/all` - Get all applications (Admin)
- `PUT /api/applications/:id/review` - Review application (Admin)

### Batches
- `GET /api/batches` - Get all batches (Admin)
- `GET /api/batches/my` - Get user's batch
- `PUT /api/batches/:id/progress` - Update batch progress (Admin)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all as read

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred database
2. Configure environment variables for production
3. Deploy to platforms like Heroku, DigitalOcean, or AWS

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or serve with nginx

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the amazing frontend framework
- Express.js team for the robust backend framework
- MongoDB team for the flexible database solution
- Tailwind CSS team for the utility-first CSS framework
