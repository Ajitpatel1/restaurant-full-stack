
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import fetch_menu

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Patel Restaurant API is running!"}


@app.get("/menu")
def get_menu():
    menu = fetch_menu()

    return {
        "status": "success",
        "data": menu
    }
