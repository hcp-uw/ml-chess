from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from database import create_db_pool
from models import Person
from crud import get_all_people, get_person, create_person, update_person, delete_person
import chess



# Create a FastAPI instance
app = FastAPI()

board = chess.Board()

@app.post("/makemove")
async def make_move(move: str):
    move = chess.Move.from_uci(move)
    board.push(move)
    
@app.post("/reset")
async def reset():
    board.reset()

@app.get("/board")
async def get_board():
    return {"board": board.fen()}

# Mount the static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Create a FastAPI event that will be triggered when the application starts.
#  It will create a database connection pool, and attach it to the application instance.
@app.on_event("startup")
async def startup_db_pool():
    app.db_pool = await create_db_pool()

# Create a FastAPI event that will be triggered when the application stops.
#  It will close the database connection pool.
@app.on_event("shutdown")
async def shutdown_db_pool():
    await app.db_pool.close()


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,                             # CORS middleware class
    allow_origins=["http://localhost:3000"],    # Only allow requests from this origin
    allow_credentials=True,                     # Lets browser access response cookies, auth headers, etc.
    allow_methods=["*"],                        # Allow all request methods
    allow_headers=["*"],                        # Allow all request headers
)