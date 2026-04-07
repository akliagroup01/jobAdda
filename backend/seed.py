import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_data():
    print("🌱 Seeding database...")
    
    # Clear existing data
    await db.users.delete_many({})
    await db.jobs.delete_many({})
    await db.applications.delete_many({})
    await db.saved_jobs.delete_many({})
    
    print("✓ Cleared existing data")
    
    # Create sample users
    users = [
        {
            "name": "John Doe",
            "email": "john@example.com",
            "password_hash": pwd_context.hash("password123"),
            "phone": "+91 9876543210",
            "location": "Bangalore, Karnataka",
            "user_type": "jobseeker",
            "experience": "5 years",
            "skills": ["React", "Node.js", "Python", "AWS"],
            "resume": "john_doe_resume.pdf",
            "profile_complete": 85,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Tech Innovators HR",
            "email": "hr@techinnovators.com",
            "password_hash": pwd_context.hash("password123"),
            "phone": "+91 9876543210",
            "location": "Bangalore, Karnataka",
            "user_type": "employer",
            "company_name": "Tech Innovators Inc.",
            "profile_complete": 90,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "name": "Creative Solutions HR",
            "email": "hr@creativesolutions.com",
            "password_hash": pwd_context.hash("password123"),
            "phone": "+91 9988776655",
            "location": "Mumbai, Maharashtra",
            "user_type": "employer",
            "company_name": "Creative Solutions",
            "profile_complete": 90,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    result = await db.users.insert_many(users)
    user_ids = result.inserted_ids
    print(f"✓ Created {len(user_ids)} users")
    
    # Create sample jobs
    jobs = [
        {
            "title": "Senior Full Stack Developer",
            "company": "Tech Innovators Inc.",
            "company_logo": "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop",
            "location": "Bangalore, Karnataka",
            "salary": "₹15-25 LPA",
            "type": "Full-time",
            "experience": "5-8 years",
            "skills": ["React", "Node.js", "MongoDB", "AWS"],
            "description": "We are looking for an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies.",
            "requirements": [
                "5+ years of experience in full stack development",
                "Strong proficiency in React and Node.js",
                "Experience with cloud platforms (AWS/Azure)",
                "Excellent problem-solving skills"
            ],
            "responsibilities": [
                "Design and develop scalable web applications",
                "Collaborate with cross-functional teams",
                "Write clean, maintainable code",
                "Mentor junior developers"
            ],
            "whatsapp_number": "919876543210",
            "contact_person": "HR Manager",
            "employer_id": user_ids[1],
            "featured": True,
            "status": "Active",
            "applicants_count": 0,
            "views_count": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "title": "UI/UX Designer",
            "company": "Creative Solutions",
            "company_logo": "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop",
            "location": "Mumbai, Maharashtra",
            "salary": "₹8-15 LPA",
            "type": "Full-time",
            "experience": "3-5 years",
            "skills": ["Figma", "Adobe XD", "Prototyping", "User Research"],
            "description": "Join our design team to create beautiful and intuitive user experiences for our products.",
            "requirements": [
                "3+ years of UI/UX design experience",
                "Proficiency in Figma and design tools",
                "Strong portfolio demonstrating design skills",
                "Understanding of design systems"
            ],
            "responsibilities": [
                "Create wireframes and prototypes",
                "Conduct user research",
                "Design user interfaces",
                "Collaborate with developers"
            ],
            "whatsapp_number": "919988776655",
            "contact_person": "Design Lead",
            "employer_id": user_ids[2],
            "featured": True,
            "status": "Active",
            "applicants_count": 0,
            "views_count": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        },
        {
            "title": "Frontend Developer",
            "company": "Tech Innovators Inc.",
            "company_logo": "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&h=100&fit=crop",
            "location": "Bangalore, Karnataka",
            "salary": "₹6-12 LPA",
            "type": "Full-time",
            "experience": "2-4 years",
            "skills": ["React", "JavaScript", "CSS", "Responsive Design"],
            "description": "Create stunning web interfaces for our diverse client portfolio.",
            "requirements": [
                "2+ years of frontend development experience",
                "Strong proficiency in React and modern JavaScript",
                "Eye for design and attention to detail",
                "Experience with responsive design"
            ],
            "responsibilities": [
                "Develop responsive web applications",
                "Implement UI designs",
                "Optimize performance",
                "Collaborate with designers"
            ],
            "whatsapp_number": "919876543210",
            "contact_person": "Tech Lead",
            "employer_id": user_ids[1],
            "featured": False,
            "status": "Active",
            "applicants_count": 0,
            "views_count": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
    ]
    
    result = await db.jobs.insert_many(jobs)
    job_ids = result.inserted_ids
    print(f"✓ Created {len(job_ids)} jobs")
    
    print("✅ Database seeded successfully!")
    print("\n📝 Test Credentials:")
    print("Job Seeker - Email: john@example.com, Password: password123")
    print("Employer (Tech Innovators) - Email: hr@techinnovators.com, Password: password123")
    print("Employer (Creative Solutions) - Email: hr@creativesolutions.com, Password: password123")

if __name__ == "__main__":
    asyncio.run(seed_data())
    client.close()
