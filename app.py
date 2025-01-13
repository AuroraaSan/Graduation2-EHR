from fastapi import FastAPI, HTTPException
from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from typing import List, Dict
from openai import OpenAI
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
nebius_api_key = os.getenv("NEBIUS_API_KEY")

# Initialize OpenAI client
client = OpenAI(
    base_url="https://api.studio.nebius.ai/v1/",
    api_key=nebius_api_key,
)

# Initialize FastAPI app
app = FastAPI()


# Define Pydantic models for input validation
class ChatMessage(BaseModel):
    conversation_history: List[Dict[str, str]]
    user_input: str


class MedicalSummaryRequest(BaseModel):
    medical_history: str


# Define Pydantic models for input validation
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


def chatbot_conversation(conversation_history, user_input):
    try:
        # Append user input to conversation history
        conversation_history.append({"role": "user", "content": user_input})

        # Call the AI model for a response
        response = client.chat.completions.create(
            model="aaditya/Llama3-OpenBioLLM-70B", messages=conversation_history
        )

        # Extract the AI's reply
        bot_reply = response.choices[0].message.content

        # Add the AI's reply to the conversation history
        conversation_history.append({"role": "assistant", "content": bot_reply})

        return bot_reply, conversation_history
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


# Endpoint for chatbot interaction
@app.post("/chat/")
async def chat_with_bot(chat_message: ChatMessage):
    """
    API endpoint for interacting with the chatbot.
    """
    bot_reply, updated_history = chatbot_conversation(
        chat_message.conversation_history, chat_message.user_input
    )
    return {"bot_reply": bot_reply, "conversation_history": updated_history}


def create_medical_summary(medical_history: str):
    try:
        # Debug log for the request payload
        # print(f"Sending to AI Model: {medical_history}")

        # Call the AI model for summarizing medical history
        response = client.chat.completions.create(
            model="aaditya/Llama3-OpenBioLLM-70B",
            messages=[
                {
                    "role": "system",
                    "content": "You are an advanced medical AI assistant trained in biomedical and clinical data summarization. Your task is to generate concise, accurate, and clinically relevant summaries of patient medical histories. These summaries should assist healthcare providers in making informed decisions by highlighting key medical conditions, allergies, medications, surgeries, and any significant trends or patterns in the patient’s health.",
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
