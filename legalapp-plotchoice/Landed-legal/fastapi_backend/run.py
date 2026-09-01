import os
import sys
import uvicorn

# Ensure the fastapi_backend directory is in Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

if __name__ == "__main__":
    print("==================================================")
    print("[FastAPI Backend] Running on http://127.0.0.1:8000")
    print("[FastAPI Swagger] Interactive Docs: http://127.0.0.1:8000/docs")
    print("[FastAPI ReDoc] ReDoc API Docs: http://127.0.0.1:8000/redoc")
    print("[FastAPI API] Base URL: http://127.0.0.1:8000/api/v1")
    print("[FastAPI Health] Health Check: http://127.0.0.1:8000/health")
    print("==================================================")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
