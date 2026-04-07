from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
from enum import Enum

class UserType(str, Enum):
    JOBSEEKER = "jobseeker"
    EMPLOYER = "employer"

class JobType(str, Enum):
    FULL_TIME = "Full-time"
    PART_TIME = "Part-time"
    CONTRACT = "Contract"
    INTERNSHIP = "Internship"

class JobStatus(str, Enum):
    ACTIVE = "Active"
    CLOSED = "Closed"

class ApplicationStatus(str, Enum):
    APPLIED = "Applied"
    UNDER_REVIEW = "Under Review"
    SHORTLISTED = "Shortlisted"
    REJECTED = "Rejected"

# User Models
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    location: str
    user_type: UserType
    company_name: Optional[str] = None
    experience: Optional[str] = None
    skills: Optional[List[str]] = []
    resume: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str = Field(alias="_id")
    profile_complete: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    experience: Optional[str] = None
    skills: Optional[List[str]] = None
    resume: Optional[str] = None
    company_name: Optional[str] = None

# Job Models
class JobBase(BaseModel):
    title: str
    company: str
    company_logo: Optional[str] = "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop"
    location: str
    salary: str
    type: JobType
    experience: str
    skills: List[str]
    description: str
    requirements: List[str]
    responsibilities: List[str]
    whatsapp_number: str
    contact_person: str
    featured: bool = False

class JobCreate(JobBase):
    pass

class Job(JobBase):
    id: str = Field(alias="_id")
    employer_id: str
    status: JobStatus = JobStatus.ACTIVE
    applicants_count: int = 0
    views_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True

class JobUpdate(BaseModel):
    title: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[str] = None
    type: Optional[JobType] = None
    experience: Optional[str] = None
    skills: Optional[List[str]] = None
    description: Optional[str] = None
    requirements: Optional[List[str]] = None
    responsibilities: Optional[List[str]] = None
    whatsapp_number: Optional[str] = None
    contact_person: Optional[str] = None
    status: Optional[JobStatus] = None
    featured: Optional[bool] = None

# Application Models
class ApplicationBase(BaseModel):
    job_id: str

class ApplicationCreate(ApplicationBase):
    pass

class Application(ApplicationBase):
    id: str = Field(alias="_id")
    job_title: str
    company: str
    applicant_id: str
    applicant_name: str
    applicant_email: str
    status: ApplicationStatus = ApplicationStatus.APPLIED
    applied_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        populate_by_name = True

class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus

# Saved Job Models
class SavedJobCreate(BaseModel):
    job_id: str

class SavedJob(BaseModel):
    id: str = Field(alias="_id")
    user_id: str
    job_id: str
    created_at: datetime

    class Config:
        populate_by_name = True

# Response Models
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User

class JobResponse(BaseModel):
    jobs: List[Job]
    total: int
    page: int
    per_page: int

class StatsOverview(BaseModel):
    active_jobs: int
    total_companies: int
    total_candidates: int
    new_jobs_today: int

class EmployerStats(BaseModel):
    active_jobs: int
    total_applicants: int
    total_views: int
    shortlisted: int

class JobSeekerStats(BaseModel):
    total_applications: int
    saved_jobs: int
    profile_views: int
