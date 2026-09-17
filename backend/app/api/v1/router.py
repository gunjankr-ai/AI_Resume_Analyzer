from fastapi import APIRouter
from app.api.v1.endpoints import resumes, jobs, matches, dashboard

api_router = APIRouter()

api_router.include_router(resumes.router)
api_router.include_router(jobs.router)
api_router.include_router(matches.router)
api_router.include_router(dashboard.router)
