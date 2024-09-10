from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google.cloud import bigquery
from google.cloud.exceptions import GoogleCloudError
from google.api_core.exceptions import GoogleAPIError
import uuid

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
client = bigquery.Client(location="europe-west3")

class User(BaseModel):
    name: str
    email: str

project_id = ""
dataset_id = ""
table_id = ""

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/user_details/")
async def run_user_details_query():

    query = f"""
    SELECT name, email
    FROM `{project_id}.{dataset_id}.{table_id}`
    LIMIT 10
    """
    
    try:
        query_job = client.query(query)
        results = query_job.result()
        names = [{"name": row["name"], "email": row["email"]} for row in results]
        
        return {"data": names}
    
    except GoogleCloudError as e:
        raise HTTPException(status_code=500, detail=f"BigQuery Error: {str(e)}")

@app.post("/create_user/")
async def create_user(user: User):
    user_id = str(uuid.uuid4())
    
    table_ref = client.dataset(dataset_id).table(table_id)
    table = client.get_table(table_ref)

    rows_to_insert = [{
        'id': user_id,
        'name': user.name,
        'email': user.email
    }]

    try:
        # Insert rows into BigQuery table
        errors = client.insert_rows_json(table, rows_to_insert)
        if errors:
            raise HTTPException(status_code=500, detail=f"Error inserting rows: {errors}")
        return {"message": "New user created successfully"}
    except GoogleAPIError as e:
        # Handle Google Cloud API errors
        raise HTTPException(status_code=500, detail=f"BigQuery Error: {str(e)}")