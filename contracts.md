# Backend API Contracts & Implementation Plan

## Overview
Transform the frontend-only job portal into a full-stack application with MongoDB backend, replacing all mock data with real database operations.

## Database Models

### 1. User Model
```python
{
    "_id": ObjectId,
    "name": str,
    "email": str (unique, indexed),
    "password": str (hashed),
    "phone": str,
    "location": str,
    "user_type": str (enum: "jobseeker" | "employer"),
    "company_name": str (optional, for employers),
    "experience": str (optional, for job seekers),
    "skills": [str] (optional, for job seekers),
    "resume": str (optional, file path for job seekers),
    "profile_complete": int (percentage),
    "created_at": datetime,
    "updated_at": datetime
}
```

### 2. Job Model
```python
{
    "_id": ObjectId,
    "title": str,
    "company": str,
    "company_logo": str,
    "location": str,
    "salary": str,
    "type": str (enum: "Full-time" | "Part-time" | "Contract" | "Internship"),
    "experience": str,
    "skills": [str],
    "description": str,
    "requirements": [str],
    "responsibilities": [str],
    "whatsapp_number": str,
    "contact_person": str,
    "employer_id": ObjectId (reference to User),
    "featured": bool,
    "status": str (enum: "Active" | "Closed"),
    "applicants_count": int,
    "views_count": int,
    "created_at": datetime,
    "updated_at": datetime
}
```

### 3. Application Model
```python
{
    "_id": ObjectId,
    "job_id": ObjectId (reference to Job),
    "job_title": str,
    "company": str,
    "applicant_id": ObjectId (reference to User),
    "applicant_name": str,
    "applicant_email": str,
    "status": str (enum: "Applied" | "Under Review" | "Shortlisted" | "Rejected"),
    "applied_date": datetime,
    "created_at": datetime,
    "updated_at": datetime
}
```

### 4. SavedJob Model
```python
{
    "_id": ObjectId,
    "user_id": ObjectId (reference to User),
    "job_id": ObjectId (reference to Job),
    "created_at": datetime
}
```

## API Endpoints

### Authentication
- **POST /api/auth/signup** - Register new user (jobseeker/employer)
- **POST /api/auth/login** - Login user (returns JWT token)
- **GET /api/auth/me** - Get current user profile (requires auth)
- **PUT /api/auth/profile** - Update user profile (requires auth)

### Jobs
- **GET /api/jobs** - Get all jobs (with filters: keyword, location, type, experience, salary)
- **GET /api/jobs/:id** - Get single job details
- **POST /api/jobs** - Create new job (requires employer auth)
- **PUT /api/jobs/:id** - Update job (requires employer auth)
- **DELETE /api/jobs/:id** - Delete job (requires employer auth)
- **GET /api/jobs/employer/:employerId** - Get jobs by employer (requires auth)
- **POST /api/jobs/:id/view** - Increment job view count

### Applications
- **POST /api/applications** - Apply to a job (requires jobseeker auth)
- **GET /api/applications/user/:userId** - Get user applications (requires auth)
- **GET /api/applications/job/:jobId** - Get job applications (requires employer auth)
- **PUT /api/applications/:id/status** - Update application status (requires employer auth)
- **DELETE /api/applications/:id** - Withdraw application (requires auth)

### Saved Jobs
- **POST /api/saved-jobs** - Save a job (requires auth)
- **GET /api/saved-jobs/user/:userId** - Get saved jobs (requires auth)
- **DELETE /api/saved-jobs/:id** - Remove saved job (requires auth)

### Stats
- **GET /api/stats/overview** - Get platform stats (jobs count, companies, candidates)
- **GET /api/stats/employer/:employerId** - Get employer dashboard stats (requires auth)
- **GET /api/stats/jobseeker/:userId** - Get jobseeker dashboard stats (requires auth)

## Mock Data to Replace

### From mock.js:
1. **mockJobs** → Database `jobs` collection
2. **mockUser** → Database `users` collection
3. **mockApplications** → Database `applications` collection
4. **mockSavedJobs** → Database `saved_jobs` collection
5. **mockEmployerJobs** → Queried from `jobs` by employer_id
6. **mockCompanies** → Derived from unique companies in jobs
7. **mockCategories** → Computed from jobs by category/skills

## Frontend Integration Changes

### Pages to Update:

1. **Home.jsx**
   - Replace `mockJobs` with API call: `GET /api/jobs?featured=true&limit=4`
   - Replace `mockCategories` with API call: `GET /api/stats/overview`

2. **JobListings.jsx**
   - Replace `mockJobs` with API call: `GET /api/jobs?keyword=&location=&type=`
   - Add pagination support
   - Implement real-time filtering

3. **JobDetails.jsx**
   - Replace job lookup with API call: `GET /api/jobs/:id`
   - Implement real save job: `POST /api/saved-jobs`
   - Implement real apply: `POST /api/applications`
   - Track view count: `POST /api/jobs/:id/view`

4. **Login.jsx**
   - Implement real login: `POST /api/auth/login`
   - Store JWT token in localStorage
   - Redirect to dashboard on success

5. **Signup.jsx**
   - Implement real signup: `POST /api/auth/signup`
   - Auto-login after signup
   - Redirect to dashboard

6. **JobSeekerDashboard.jsx**
   - Fetch user data: `GET /api/auth/me`
   - Fetch applications: `GET /api/applications/user/:userId`
   - Fetch saved jobs: `GET /api/saved-jobs/user/:userId`
   - Update profile: `PUT /api/auth/profile`

7. **EmployerDashboard.jsx**
   - Fetch employer jobs: `GET /api/jobs/employer/:employerId`
   - Create job: `POST /api/jobs`
   - Update job: `PUT /api/jobs/:id`
   - Delete job: `DELETE /api/jobs/:id`
   - Get applications: `GET /api/applications/job/:jobId`

## Authentication Flow

1. User signs up/logs in
2. Backend generates JWT token with user_id and user_type
3. Frontend stores token in localStorage
4. All authenticated requests include: `Authorization: Bearer <token>`
5. Backend middleware validates token and attaches user to request

## Implementation Steps

1. ✅ Create database models
2. ✅ Implement authentication endpoints with JWT
3. ✅ Implement jobs CRUD endpoints
4. ✅ Implement applications endpoints
5. ✅ Implement saved jobs endpoints
6. ✅ Implement stats endpoints
7. ✅ Create authentication context in frontend
8. ✅ Update all pages to use API calls
9. ✅ Add loading states and error handling
10. ✅ Test all flows end-to-end

## Security Considerations

- Password hashing using bcrypt
- JWT token-based authentication
- Protected routes (employer can only modify their jobs)
- Input validation on all endpoints
- CORS configured for frontend domain
- Rate limiting on auth endpoints (optional)

## Data Seeding

Create seed script to populate initial data:
- Sample users (jobseekers and employers)
- Sample jobs with WhatsApp numbers
- Sample applications
- Sample saved jobs
