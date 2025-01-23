from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from typing import List, Dict
from openai import OpenAI
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from datetime import datetime
import uuid

# Load environment variables
load_dotenv()
nebius_api_key = os.getenv("NEBIUS_API_KEY")
mongo_uri = os.getenv("MONGO_URI")  # Add MongoDB connection URI in .env

# Specify the local path to the downloaded model
local_model_path = "/code/model"


# Initialize OpenAI client
client = OpenAI(
    base_url="https://api.studio.nebius.ai/v1/",
    api_key=nebius_api_key,
)

# Initialize MongoDB client
client_mongo = MongoClient(mongo_uri)
db = client_mongo["Patient_Service"]
chatbot_history = db["chatbot_history"]


# Initialize FastAPI app
app = FastAPI()


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3002"],  # Allow specific origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Define Pydantic models for input validation
class ChatMessage(BaseModel):
    conversation_history: List[Dict[str, str]]
    user_input: str


class MedicalSummaryRequest(BaseModel):
    medical_history: str


class Visit(BaseModel):
    purpose: str
    date: str


class MedicalCondition(BaseModel):
    name: str
    diagnosed_on: str


class Medication(BaseModel):
    name: str
    dosage: str
    frequency: str
    purpose: str


class Surgery(BaseModel):
    name: str
    date: str


class PatientData(BaseModel):
    patient_id: str
    blood_type: str
    weight: int
    height: int
    medical_conditions: List[MedicalCondition] = []
    allergies: List[str] = []
    medications: List[Medication] = []
    surgeries: List[Surgery] = []
    visits: List[Visit] = []
    createdAt: str
    updatedAt: str


# Nested models
class MedicalCondition(BaseModel):
    condition_name: str
    diagnosis_date: str
    status: str
    severity: str
    notes: Optional[str] = None


class Allergy(BaseModel):
    allergen_name: str
    allergen_type: str
    reaction: str
    severity: str
    diagnosis_date: str
    treatment_plan: Optional[str] = None
    emergency_instructions: Optional[str] = None
    medications_to_avoid: Optional[List[str]] = None
    status: Optional[str] = None


class Medication(BaseModel):
    name: str
    dosage: str
    frequency: str
    purpose: str


class Surgery(BaseModel):
    type: str
    procedure_date: str
    status: str
    recovery_notes: Optional[str] = None


class Vitals(BaseModel):
    heart_rate: Optional[int] = None
    blood_pressure: Optional[str] = None
    temperature: Optional[str] = None
    oxygen_saturation: Optional[int] = None
    respiratory_rate: Optional[int] = None
    bmi: Optional[float] = None


class Visit(BaseModel):
    date: str
    visit_type: str
    reason: str
    vitals: Optional[Vitals] = None
    duration: Optional[int] = None


# Main PatientData model
class PatientData(BaseModel):
    patient_id: str
    blood_type: str
    weight: int
    height: int
    medical_conditions: Optional[List[MedicalCondition]] = []
    allergies: Optional[List[Allergy]] = []
    medications: Optional[List[Medication]] = []
    surgeries: Optional[List[Surgery]] = []
    visits: Optional[List[Visit]] = []
    createdAt: str
    updatedAt: str  # Chatbot conversation function


# Pydantic models for validation
class InitiateChatRequest(BaseModel):
    doctor_id: str
    user_input: str


class ContinueChatRequest(BaseModel):
    conversation_id: str
    user_input: str


# Helper function to interact with OpenAI API
def get_chatbot_response(conversation_history):
    try:
        response = client.chat.completions.create(
            model="aaditya/Llama3-OpenBioLLM-70B", messages=conversation_history
        )
        return response.choices[0].message.content
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error interacting with AI: {str(e)}"
        )


# ---------------------------------------------------


# API to start a new conversation
@app.post("/chat/initiate/")
async def initiate_chat(request: InitiateChatRequest):
    """
    Start a new chat session.
    """
    conversation_id = str(uuid.uuid4())  # Generate a unique conversation ID

    # System role
    system_role = {
        "role": "system",
        "content": "You are a helpful medical assistant specializing in healthcare-related queries.",
    }

    # Initial conversation
    conversation_history = [
        system_role,
        {"role": "user", "content": request.user_input},
    ]
    bot_reply = get_chatbot_response(conversation_history)

    # Save the new conversation to the database
    chatbot_history.insert_one(
        {
            "conversation_id": conversation_id,
            "doctor_id": request.doctor_id,
            "system_role": system_role["content"],
            "conversation": [
                {"role": "user", "content": request.user_input},
                {"role": "assistant", "content": bot_reply},
            ],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
    )

    return {"conversation_id": conversation_id, "bot_reply": bot_reply}


# API to continue an existing conversation
@app.post("/chat/continue/")
async def continue_chat(request: ContinueChatRequest):
    """
    Continue a conversation using the conversation_id.
    """
    # Fetch the conversation from the database
    conversation = chatbot_history.find_one(
        {"conversation_id": request.conversation_id}
    )

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Add the new user input
    conversation_history = conversation["conversation"]
    conversation_history.append({"role": "user", "content": request.user_input})

    # Get the bot's reply
    bot_reply = get_chatbot_response(
        [{"role": "system", "content": conversation["system_role"]}]
        + conversation_history
    )

    # Update the conversation in the database
    conversation_history.append({"role": "assistant", "content": bot_reply})
    chatbot_history.update_one(
        {"conversation_id": request.conversation_id},
        {
            "$set": {
                "conversation": conversation_history,
                "updated_at": datetime.utcnow(),
            }
        },
    )

    return {"bot_reply": bot_reply}


# ---------------------------------------------------


# API to get all the conversations for a specific doctor
@app.get("/chats/")
async def get_all_conversations(doctor_id: str):
    """
    Retrieve all conversations for a specific doctor.
    Each conversation includes its ID and a name (first 30 characters of the latest question).
    """
    try:
        # Find all conversations for the doctor
        conversations = chatbot_history.find({"doctor_id": doctor_id}).sort(
            "updated_at", -1
        )

        # Create a list with ID and a name (latest user question)
        results = []
        for convo in conversations:
            # Get the latest user question
            latest_user_question = next(
                (
                    msg["content"]
                    for msg in reversed(convo["conversation"])
                    if msg["role"] == "user"
                ),
                "No user questions",
            )
            # Add conversation name and ID to results
            results.append(
                {
                    "conversation_id": convo["conversation_id"],
                    "name": latest_user_question[:30],  # Truncate to 30 characters
                }
            )

        return {"conversations": results}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving conversations: {str(e)}"
        )


# API to get the full history of a specific conversation
@app.get("/chat/{conversation_id}")
async def get_conversation_history(conversation_id: str):
    """
    Retrieve the full history of a specific conversation by its ID.
    """
    try:
        # Fetch the conversation by its ID
        conversation = chatbot_history.find_one({"conversation_id": conversation_id})

        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

        return {
            "conversation_id": conversation["conversation_id"],
            "doctor_id": conversation["doctor_id"],
            "conversation": conversation["conversation"],
            "system_role": conversation["system_role"],
            "created_at": conversation["created_at"],
            "updated_at": conversation["updated_at"],
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving conversation history: {str(e)}"
        )


# --------------------------------------------------


# function to create a medical summary using the AI model
def create_medical_summary(medical_history: str):
    try:
        # Debug log for the request payload
        # print(f"Sending to AI Model: {medical_history}")
        print(medical_history)
        # Call the AI model for summarizing medical history
        response = client.chat.completions.create(
            model="aaditya/Llama3-OpenBioLLM-70B",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert and experienced from the healthcare and biomedical domain with extensive medical knowledge and practical experience. Your name is Hamo, an Egyptian chatbot that helps doctors and patients, who is willing to help answer the user's query with explanation. Please summarize the key points from the following clinical note, focusing on the patient's chief complaint, relevant medical history, physical examination findings, diagnosis, and treatment plan:, keep it short and concise.",
                },
                {
                    "role": "user",
                    "content": f"Summarize the following medical history: {medical_history}",
                },
            ],
        )
        summary = response.choices[0].message.content
        # print(f"AI Model Response: {summary}")  # Debug log
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


# API endpoint for creating a summary of a medical history
@app.post("/create_summary/")
async def summarize_medical_history(patient_data: PatientData):
    """
    API endpoint for creating a summary of a medical history.
    """
    # Use the updated process_patient_data function
    readable_medical_history = process_patient_data(patient_data.dict())
    # print(f"Readable Medical History: {readable_medical_history}")  # Debug log

    # Pass readable_medical_history to the AI model
    medical_history_summary = create_medical_summary(readable_medical_history)

    return {"medical_history": medical_history_summary}


# Helper function to process patient data
def process_patient_data(data):
    # Medical Conditions
    conditions_str = (
        ", ".join(
            [
                f"{cond['condition_name']} (diagnosed on {cond['diagnosis_date']}, "
                f"severity: {cond['severity']}, status: {cond['status']})"
                for cond in data.get("medical_conditions", [])
            ]
        )
        if data.get("medical_conditions")
        else "No recorded medical conditions"
    )

    # Allergies
    allergies_str = (
        ", ".join(
            [
                f"{allergy['allergen_name']} ({allergy['allergen_type']} allergy, "
                f"reaction: {allergy['reaction']}, severity: {allergy['severity']})"
                for allergy in data.get("allergies", [])
            ]
        )
        if data.get("allergies")
        else "No known allergies"
    )

    # Medications
    medications_str = (
        ", ".join(
            [
                f"{med['name']} {med['dosage']} (taken {med['frequency']} for {med['purpose']})"
                for med in data.get("medications", [])
            ]
        )
        if data.get("medications")
        else "No current medications"
    )

    # Surgeries
    surgeries_str = (
        ", ".join(
            [
                f"{surgery['type']} (performed on {surgery['procedure_date']}, status: {surgery['status']})"
                for surgery in data.get("surgeries", [])
            ]
        )
        if data.get("surgeries")
        else "No recorded surgeries"
    )

    # Visits
    visits_str = f"{len(data.get('visits', []))} recorded visits"
    if data.get("visits"):
        latest_visit = data["visits"][-1]
        visits_str += (
            f". Latest visit: {latest_visit['visit_type']} on {latest_visit['date']}, "
            f"reason: {latest_visit['reason']}, duration: {latest_visit.get('duration', 'unknown')} minutes."
        )

    # General Patient Information
    medical_history = (
        f"This is a summary of the medical history for patient Ahmed Hagag. "
        f"Patient ID: {data.get('patient_id', 'Unknown ID')}. "
        f"Blood Type: {data.get('blood_type', 'Unknown Blood Type')}. "
        f"Weight: {data.get('weight', 'Unknown Weight')}kg. Height: {data.get('height', 'Unknown Height')}cm. "
        f"The patient has the following medical conditions: {conditions_str}. "
        f"Allergies include: {allergies_str}. "
        f"The patient is currently prescribed the following medications: {medications_str}. "
        f"The patient has undergone the following surgeries: {surgeries_str}. "
        f"{visits_str} "
        f"Created on {data.get('createdAt', 'Unknown Created Date')} and "
        f"updated on {data.get('updatedAt', 'Unknown Updated Date')}."
    )

    return medical_history


# ---------------------------------------------------


from transformers import pipeline
import shutil

# Initialize the classifier using the local model path
classifier = pipeline(task="image-classification", model=local_model_path)


# Endpoint to classify an X-ray image
@app.post("/classify-xray/")
async def classify_xray(file: UploadFile = File(...)):
    """
    Endpoint to classify an X-ray image as 'Pneumonia' or 'Normal'.
    """
    try:
        # Save the uploaded file to a temporary directory
        temp_file_path = f"temp_{file.filename}"
        with open(temp_file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Use the classifier pipeline to classify the X-ray image
        result = classifier(temp_file_path)

        # Clean up the temporary file
        os.remove(temp_file_path)

        # Extract and return the classification result
        if result and len(result) > 0:
            return JSONResponse(
                content={
                    "classification": result[0]["label"],
                    "score": result[0]["score"],
                }
            )
        else:
            raise HTTPException(
                status_code=500,
                detail="Classification failed: No result returned from the model.",
            )

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error processing the X-ray image: {str(e)}"
        )
