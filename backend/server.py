from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Query
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
from datetime import datetime
from bson import ObjectId
from typing import List, Optional
import os
import logging

from models import (
    UserCreate, UserLogin, User, UserUpdate, Token,
    JobCreate, Job, JobUpdate, JobResponse,
    ApplicationCreate, Application, ApplicationStatusUpdate,
    SavedJobCreate, SavedJob,
    StatsOverview, EmployerStats, JobSeekerStats,
    UserType, JobStatus, ApplicationStatus
)
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user_id
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Collections
users_collection = db.users
jobs_collection = db.jobs
applications_collection = db.applications
saved_jobs_collection = db.saved_jobs

# Create the main app
app = FastAPI()

# Create API router with /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Helper functions
def user_helper(user) -> dict:
    return {
        "_id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "phone": user["phone"],
        "location": user["location"],
        "user_type": user["user_type"],
        "company_name": user.get("company_name"),
        "experience": user.get("experience"),
        "skills": user.get("skills", []),
        "resume": user.get("resume"),
        "profile_complete": user.get("profile_complete", 0),
        "created_at": user["created_at"],
        "updated_at": user["updated_at"]
    }

def job_helper(job) -> dict:
    return {
        "_id": str(job["_id"]),
        "title": job["title"],
        "company": job["company"],
        "company_logo": job.get("company_logo", ""),
        "location": job["location"],
        "salary": job["salary"],
        "type": job["type"],
        "experience": job["experience"],
        "skills": job["skills"],
        "description": job["description"],
        "requirements": job["requirements"],
        "responsibilities": job["responsibilities"],
        "whatsapp_number": job["whatsapp_number"],
        "contact_person": job["contact_person"],
        "employer_id": str(job["employer_id"]),
        "featured": job.get("featured", False),
        "status": job.get("status", "Active"),
        "applicants_count": job.get("applicants_count", 0),
        "views_count": job.get("views_count", 0),
        "created_at": job["created_at"],
        "updated_at": job["updated_at"]
    }

def application_helper(app) -> dict:
    return {
        "_id": str(app["_id"]),
        "job_id": str(app["job_id"]),
        "job_title": app["job_title"],
        "company": app["company"],
        "applicant_id": str(app["applicant_id"]),
        "applicant_name": app["applicant_name"],
        "applicant_email": app["applicant_email"],
        "status": app["status"],
        "applied_date": app["applied_date"],
        "created_at": app["created_at"],
        "updated_at": app["updated_at"]
    }

# ==================== AUTHENTICATION ENDPOINTS ====================

@api_router.post("/auth/signup", response_model=Token)
async def signup(user_data: UserCreate):
    # Check if user exists
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = get_password_hash(user_data.password)
    
    # Calculate profile completion
    profile_complete = 50  # Base score
    if user_data.phone: profile_complete += 10
    if user_data.location: profile_complete += 10
    if user_data.user_type == UserType.JOBSEEKER:
        if user_data.experience: profile_complete += 15
        if user_data.skills: profile_complete += 15
    else:
        if user_data.company_name: profile_complete += 30
    
    # Create user document
    user_dict = user_data.dict()
    del user_dict["password"]
    user_dict["password_hash"] = hashed_password
    user_dict["profile_complete"] = profile_complete
    user_dict["created_at"] = datetime.utcnow()
    user_dict["updated_at"] = datetime.utcnow()
    
    result = await users_collection.insert_one(user_dict)
    user_dict["_id"] = result.inserted_id
    
    # Create access token
    access_token = create_access_token(data={"sub": str(result.inserted_id)})
    
    user_response = user_helper(user_dict)
    return Token(access_token=access_token, user=User(**user_response))

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    user = await users_collection.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": str(user["_id"])})
    user_response = user_helper(user)
    return Token(access_token=access_token, user=User(**user_response))

@api_router.get("/auth/me", response_model=User)
async def get_current_user(user_id: str = Depends(get_current_user_id)):
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user_helper(user))

@api_router.put("/auth/profile", response_model=User)
async def update_profile(
    user_update: UserUpdate,
    user_id: str = Depends(get_current_user_id)
):
    update_data = {k: v for k, v in user_update.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    update_data["updated_at"] = datetime.utcnow()
    
    result = await users_collection.find_one_and_update(
        {"_id": ObjectId(user_id)},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    
    return User(**user_helper(result))

# ==================== JOB ENDPOINTS ====================

@api_router.get("/jobs", response_model=JobResponse)
async def get_jobs(
    keyword: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    job_type: Optional[str] = Query(None),
    featured: Optional[bool] = Query(None),
    employer_id: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100)
):
    query = {"status": JobStatus.ACTIVE}
    
    if keyword:
        query["$or"] = [
            {"title": {"$regex": keyword, "$options": "i"}},
            {"company": {"$regex": keyword, "$options": "i"}},
            {"skills": {"$regex": keyword, "$options": "i"}}
        ]
    
    if location:
        query["location"] = {"$regex": location, "$options": "i"}
    
    if job_type:
        query["type"] = job_type
    
    if featured is not None:
        query["featured"] = featured
    
    if employer_id:
        query["employer_id"] = ObjectId(employer_id)
    
    total = await jobs_collection.count_documents(query)
    skip = (page - 1) * per_page
    
    jobs_cursor = jobs_collection.find(query).sort("created_at", -1).skip(skip).limit(per_page)
    jobs = await jobs_cursor.to_list(length=per_page)
    
    jobs_list = [Job(**job_helper(job)) for job in jobs]
    
    return JobResponse(jobs=jobs_list, total=total, page=page, per_page=per_page)

@api_router.get("/jobs/{job_id}", response_model=Job)
async def get_job(job_id: str):
    if not ObjectId.is_valid(job_id):
        raise HTTPException(status_code=400, detail="Invalid job ID")
    
    job = await jobs_collection.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    return Job(**job_helper(job))

@api_router.post("/jobs", response_model=Job)
async def create_job(
    job_data: JobCreate,
    user_id: str = Depends(get_current_user_id)
):
    # Verify user is employer
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user or user["user_type"] != UserType.EMPLOYER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can create jobs"
        )
    
    job_dict = job_data.dict()
    job_dict["employer_id"] = ObjectId(user_id)
    job_dict["company"] = user.get("company_name", "Company")
    job_dict["status"] = JobStatus.ACTIVE
    job_dict["applicants_count"] = 0
    job_dict["views_count"] = 0
    job_dict["created_at"] = datetime.utcnow()
    job_dict["updated_at"] = datetime.utcnow()
    
    result = await jobs_collection.insert_one(job_dict)
    job_dict["_id"] = result.inserted_id
    
    return Job(**job_helper(job_dict))

@api_router.put("/jobs/{job_id}", response_model=Job)
async def update_job(
    job_id: str,
    job_update: JobUpdate,
    user_id: str = Depends(get_current_user_id)
):
    if not ObjectId.is_valid(job_id):
        raise HTTPException(status_code=400, detail="Invalid job ID")
    
    # Verify job belongs to user
    job = await jobs_collection.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if str(job["employer_id"]) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this job"
        )
    
    update_data = {k: v for k, v in job_update.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    update_data["updated_at"] = datetime.utcnow()
    
    result = await jobs_collection.find_one_and_update(
        {"_id": ObjectId(job_id)},
        {"$set": update_data},
        return_document=True
    )
    
    return Job(**job_helper(result))

@api_router.delete("/jobs/{job_id}")
async def delete_job(
    job_id: str,
    user_id: str = Depends(get_current_user_id)
):
    if not ObjectId.is_valid(job_id):
        raise HTTPException(status_code=400, detail="Invalid job ID")
    
    job = await jobs_collection.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if str(job["employer_id"]) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this job"
        )
    
    await jobs_collection.delete_one({"_id": ObjectId(job_id)})
    await applications_collection.delete_many({"job_id": ObjectId(job_id)})
    await saved_jobs_collection.delete_many({"job_id": ObjectId(job_id)})
    
    return {"message": "Job deleted successfully"}

@api_router.post("/jobs/{job_id}/view")
async def increment_job_view(job_id: str):
    if not ObjectId.is_valid(job_id):
        raise HTTPException(status_code=400, detail="Invalid job ID")
    
    await jobs_collection.update_one(
        {"_id": ObjectId(job_id)},
        {"$inc": {"views_count": 1}}
    )
    
    return {"message": "View count incremented"}

# ==================== APPLICATION ENDPOINTS ====================

@api_router.post("/applications", response_model=Application)
async def create_application(
    app_data: ApplicationCreate,
    user_id: str = Depends(get_current_user_id)
):
    # Verify user is jobseeker
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user or user["user_type"] != UserType.JOBSEEKER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only job seekers can apply to jobs"
        )
    
    # Check if already applied
    existing = await applications_collection.find_one({
        "job_id": ObjectId(app_data.job_id),
        "applicant_id": ObjectId(user_id)
    })
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied to this job"
        )
    
    # Get job details
    job = await jobs_collection.find_one({"_id": ObjectId(app_data.job_id)})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    app_dict = {
        "job_id": ObjectId(app_data.job_id),
        "job_title": job["title"],
        "company": job["company"],
        "applicant_id": ObjectId(user_id),
        "applicant_name": user["name"],
        "applicant_email": user["email"],
        "status": ApplicationStatus.APPLIED,
        "applied_date": datetime.utcnow(),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    result = await applications_collection.insert_one(app_dict)
    app_dict["_id"] = result.inserted_id
    
    # Increment applicants count
    await jobs_collection.update_one(
        {"_id": ObjectId(app_data.job_id)},
        {"$inc": {"applicants_count": 1}}
    )
    
    return Application(**application_helper(app_dict))

@api_router.get("/applications/user/{user_id_param}", response_model=List[Application])
async def get_user_applications(
    user_id_param: str,
    user_id: str = Depends(get_current_user_id)
):
    if user_id_param != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    apps_cursor = applications_collection.find(
        {"applicant_id": ObjectId(user_id)}
    ).sort("created_at", -1)
    
    apps = await apps_cursor.to_list(length=100)
    return [Application(**application_helper(app)) for app in apps]

@api_router.get("/applications/job/{job_id}", response_model=List[Application])
async def get_job_applications(
    job_id: str,
    user_id: str = Depends(get_current_user_id)
):
    # Verify job belongs to employer
    job = await jobs_collection.find_one({"_id": ObjectId(job_id)})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    if str(job["employer_id"]) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    apps_cursor = applications_collection.find(
        {"job_id": ObjectId(job_id)}
    ).sort("created_at", -1)
    
    apps = await apps_cursor.to_list(length=1000)
    return [Application(**application_helper(app)) for app in apps]

@api_router.delete("/applications/{app_id}")
async def delete_application(
    app_id: str,
    user_id: str = Depends(get_current_user_id)
):
    app = await applications_collection.find_one({"_id": ObjectId(app_id)})
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if str(app["applicant_id"]) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    await applications_collection.delete_one({"_id": ObjectId(app_id)})
    
    # Decrement applicants count
    await jobs_collection.update_one(
        {"_id": app["job_id"]},
        {"$inc": {"applicants_count": -1}}
    )
    
    return {"message": "Application withdrawn successfully"}

# ==================== SAVED JOBS ENDPOINTS ====================

@api_router.post("/saved-jobs", response_model=SavedJob)
async def save_job(
    saved_job_data: SavedJobCreate,
    user_id: str = Depends(get_current_user_id)
):
    # Check if already saved
    existing = await saved_jobs_collection.find_one({
        "user_id": ObjectId(user_id),
        "job_id": ObjectId(saved_job_data.job_id)
    })
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job already saved"
        )
    
    saved_dict = {
        "user_id": ObjectId(user_id),
        "job_id": ObjectId(saved_job_data.job_id),
        "created_at": datetime.utcnow()
    }
    
    result = await saved_jobs_collection.insert_one(saved_dict)
    saved_dict["_id"] = result.inserted_id
    
    return SavedJob(
        _id=str(saved_dict["_id"]),
        user_id=str(saved_dict["user_id"]),
        job_id=str(saved_dict["job_id"]),
        created_at=saved_dict["created_at"]
    )

@api_router.get("/saved-jobs/user/{user_id_param}")
async def get_saved_jobs(
    user_id_param: str,
    user_id: str = Depends(get_current_user_id)
):
    if user_id_param != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    saved_cursor = saved_jobs_collection.find(
        {"user_id": ObjectId(user_id)}
    ).sort("created_at", -1)
    
    saved_jobs = await saved_cursor.to_list(length=100)
    
    # Get job details for each saved job
    job_ids = [saved["job_id"] for saved in saved_jobs]
    jobs_cursor = jobs_collection.find({"_id": {"$in": job_ids}})
    jobs = await jobs_cursor.to_list(length=100)
    
    jobs_dict = {str(job["_id"]): job for job in jobs}
    
    result = []
    for saved in saved_jobs:
        job_id = str(saved["job_id"])
        if job_id in jobs_dict:
            job_data = job_helper(jobs_dict[job_id])
            result.append(Job(**job_data))
    
    return result

@api_router.delete("/saved-jobs/job/{job_id}")
async def unsave_job(
    job_id: str,
    user_id: str = Depends(get_current_user_id)
):
    result = await saved_jobs_collection.delete_one({
        "user_id": ObjectId(user_id),
        "job_id": ObjectId(job_id)
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Saved job not found")
    
    return {"message": "Job removed from saved jobs"}

# ==================== STATS ENDPOINTS ====================

@api_router.get("/stats/overview", response_model=StatsOverview)
async def get_stats_overview():
    active_jobs = await jobs_collection.count_documents({"status": JobStatus.ACTIVE})
    
    # Count unique companies
    companies = await jobs_collection.distinct("company")
    total_companies = len(companies)
    
    # Count job seekers
    total_candidates = await users_collection.count_documents({"user_type": UserType.JOBSEEKER})
    
    # Count jobs created today
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    new_jobs_today = await jobs_collection.count_documents({
        "created_at": {"$gte": today_start}
    })
    
    return StatsOverview(
        active_jobs=active_jobs,
        total_companies=total_companies,
        total_candidates=total_candidates,
        new_jobs_today=new_jobs_today
    )

@api_router.get("/stats/employer/{employer_id}", response_model=EmployerStats)
async def get_employer_stats(
    employer_id: str,
    user_id: str = Depends(get_current_user_id)
):
    if employer_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    active_jobs = await jobs_collection.count_documents({
        "employer_id": ObjectId(employer_id),
        "status": JobStatus.ACTIVE
    })
    
    total_applicants = await applications_collection.count_documents({
        "job_id": {"$in": [
            job["_id"] async for job in jobs_collection.find({"employer_id": ObjectId(employer_id)})
        ]}
    })
    
    # Get total views
    pipeline = [
        {"$match": {"employer_id": ObjectId(employer_id)}},
        {"$group": {"_id": None, "total_views": {"$sum": "$views_count"}}}
    ]
    result = await jobs_collection.aggregate(pipeline).to_list(1)
    total_views = result[0]["total_views"] if result else 0
    
    shortlisted = await applications_collection.count_documents({
        "status": ApplicationStatus.SHORTLISTED
    })
    
    return EmployerStats(
        active_jobs=active_jobs,
        total_applicants=total_applicants,
        total_views=total_views,
        shortlisted=shortlisted
    )

@api_router.get("/stats/jobseeker/{jobseeker_id}", response_model=JobSeekerStats)
async def get_jobseeker_stats(
    jobseeker_id: str,
    user_id: str = Depends(get_current_user_id)
):
    if jobseeker_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized"
        )
    
    total_applications = await applications_collection.count_documents({
        "applicant_id": ObjectId(jobseeker_id)
    })
    
    saved_jobs_count = await saved_jobs_collection.count_documents({
        "user_id": ObjectId(jobseeker_id)
    })
    
    # Mock profile views for now
    profile_views = 127
    
    return JobSeekerStats(
        total_applications=total_applications,
        saved_jobs=saved_jobs_count,
        profile_views=profile_views
    )

# Include router in app
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
