from fastapi import FastAPI

app = FastAPI()

@app.get("/status")
def root():
    return {"message":"hello"}