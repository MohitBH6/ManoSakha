from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, chatbot,admin_auth,user, admin,discussion, resources, student,assessment_api, student_resources, appointments, c_appointments # adjust if your folder structure is different
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/static", StaticFiles(directory="app/static"), name="static")
# Allow all origins for simplicity
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include router
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(chatbot.router)
app.include_router(admin_auth.router, prefix="/admin")
app.include_router(admin.router, prefix="/admin")
app.include_router(resources.router, prefix="/admin/resources")
app.include_router(student.router)
app.include_router(student_resources.router, prefix="/student/resources", tags=["Student Resources"])
app.include_router(assessment_api.router)
app.include_router(discussion.router)
app.include_router(appointments.router, prefix="/student/appointments", tags=["Appointments"])
app.include_router(c_appointments.router, prefix="/appointments", tags=["appointments"])
