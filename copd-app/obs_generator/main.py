from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import convert
import os
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"]
)

@app.get("/generate/{id}")
async def run_scripts(id: str):
    try:
        # Step 1: run generator.py
        generator_result = subprocess.run(['python3', 'generator.py'], capture_output=True, text=True)

        if generator_result.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Generator script failed: {generator_result.stderr}")

        # Step 2: run convert.py
        convert.run(id)

        # Step 3: read the JSON content
        json_path = f'./convert/fhir_obs_{id}_medium.json'
        if not os.path.exists(json_path):
            raise HTTPException(status_code=404, detail=f"JSON file not found: {json_path}")

        with open(json_path, 'r') as json_file:
            json_content = json.load(json_file)

        return {"message": "Scripts executed successfully", "data": json_content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Script execution failed: {str(e)}")
