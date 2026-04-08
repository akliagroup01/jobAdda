# JobAdda - Job Portal Platform

A full-stack job portal application similar to Indeed/Naukri with WhatsApp integration for instant job applications.

## 🎯 Features

- **User Authentication** - JWT-based secure login for Job Seekers & Employers
- **Job Listings** - Search, filter, and browse jobs
- **WhatsApp Apply** - FREE instant apply via WhatsApp (no login required for basic apply)
- **Employer Dashboard** - Post jobs, manage listings, view applicants
- **Job Seeker Dashboard** - Apply to jobs, save favorites, track applications
- **Real-time Search** - Filter by location, job type, salary, experience
- **Mobile Responsive** - Works perfectly on all devices

## 🛠️ Tech Stack

**Frontend:**
- React 19
- React Router
- Tailwind CSS
- Shadcn UI Components
- Axios

**Backend:**
- FastAPI (Python)
- MongoDB (Database)
- JWT Authentication
- Motor (Async MongoDB driver)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and yarn
- Python 3.8+
- MongoDB

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd jobadda
```

2. **Install Frontend Dependencies**
```bash
cd frontend
yarn install
```

3. **Install Backend Dependencies**
```bash
cd ../backend
pip install -r requirements.txt
```

4. **Setup Environment Variables**

Frontend `.env`:
```
REACT_APP_BACKEND_URL=http://localhost:8001
```

Backend `.env`:
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=job_portal
SECRET_KEY=your-secret-key-here
```

5. **Seed Database (Optional)**
```bash
cd backend
python seed.py
```

6. **Run the Application**

Terminal 1 - Backend:
```bash
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

Terminal 2 - Frontend:
```bash
cd frontend
yarn start
```

Visit: `http://localhost:3000`

## 🔐 Demo Credentials

**Job Seeker:**
- Email: `john@example.com`
- Password: `password123`

**Employer:**
- Email: `hr@techinnovators.com`
- Password: `password123`

## 📱 WhatsApp Integration

Jobs include WhatsApp numbers for instant contact:
- Click "Apply via WhatsApp" button
- Opens WhatsApp with pre-filled message
- Direct communication with employer
- **100% FREE** for both parties

## 🌐 Deployment

### Deploy to Vercel (Frontend) - FREE

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Set build settings:
   - Framework: Create React App
   - Build Command: `yarn build`
   - Output Directory: `build`
   - Root Directory: `frontend`
5. Add environment variable:
   - `REACT_APP_BACKEND_URL`: Your backend URL
6. Deploy!

### Deploy Backend (Railway/Render) - FREE

**Option 1: Railway**
1. Go to [Railway](https://railway.app)
2. Connect GitHub repo
3. Add MongoDB service
4. Add environment variables
5. Deploy

**Option 2: Render**
1. Go to [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
6. Add environment variables
7. Deploy

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (employer only)
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Applications
- `POST /api/applications` - Apply to job
- `GET /api/applications/user/:userId` - Get user's applications
- `GET /api/applications/job/:jobId` - Get job's applications

### Saved Jobs
- `POST /api/saved-jobs` - Save a job
- `GET /api/saved-jobs/user/:userId` - Get saved jobs
- `DELETE /api/saved-jobs/job/:jobId` - Remove saved job

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ using Emergent AI

## 🙏 Acknowledgments

- Shadcn UI for beautiful components
- FastAPI for the amazing backend framework
- MongoDB for flexible database solution
