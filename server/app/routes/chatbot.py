import os
import google.generativeai as genai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google.generativeai.types import HarmCategory, HarmBlockThreshold

# -----------------------------------------------------------------------------
# 1. Configuration and Setup
# -----------------------------------------------------------------------------

# It is recommended to install the following packages:
# pip install fastapi uvicorn google-generativeai pydantic
# This ensures all necessary dependencies are available.

# Load API key from environment variables for security.
# This assumes you have set an environment variable named 'GENAI_API_KEY'.
genai.configure(api_key=os.getenv("GENAI_API_KEY"))

# Define a system prompt to set the chatbot's persona and rules.
# This is crucial for a mental health application.
SYSTEM_PROMPT = """
You are a supportive and empathetic mental health first-aid assistant. Your purpose is to listen,
provide general encouragement, and offer simple, actionable coping strategies like
breathing exercises, journaling prompts, or mindfulness techniques.

You are NOT a licensed therapist, medical professional, or crisis hotline. You MUST
explicitly state this limitation and refer the user to professional help when appropriate.

Do not:
- Give a diagnosis or medical advice.
- Prescribe medication.
- Handle crisis situations involving self-harm, suicide, or violence.
- Use overly clinical or formal language.

Your primary goal is to provide a safe, non-judgmental space for a user to express their feelings
and guide them toward professional resources when their needs exceed your capabilities.
"""

# Define explicit safety settings for sensitive content.
# This is a critical safety measure for a mental health application.
# The `BLOCK_HIGH_AND_ABOVE` attribute is not a valid option and has been corrected.
safety_settings = [
    {
        "category": HarmCategory.HARM_CATEGORY_HARASSMENT,
        "threshold": HarmBlockThreshold.BLOCK_NONE
    },
    {
        "category": HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        "threshold": HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
    },
    {
        "category": HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        "threshold": HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    {
        "category": HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        "threshold": HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
    },
]

# -----------------------------------------------------------------------------
# 2. API Models and Router Initialization
# -----------------------------------------------------------------------------

router = APIRouter()

# Pydantic models for request and response data validation
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
    is_crisis_response: bool = False

# Initialize the Gemini model with a chat session for conversational memory.
# In a real-world app, you would use a database to store and retrieve chat history
# for each user. For this example, we use a simple in-memory store.
global_chat_session = genai.GenerativeModel('gemini-2.5-flash').start_chat(history=[
    {"role": "user", "parts": [SYSTEM_PROMPT]},
    {"role": "model", "parts": ["Hello. I am here to listen. You can tell me what's on your mind."]}
])


# -----------------------------------------------------------------------------
# 3. API Endpoint
# -----------------------------------------------------------------------------

@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """
    Handles a chat request, processes it with the Gemini model, and returns a response.
    """
    try:
        # Check for crisis keywords. This is an extra safety layer.
        crisis_keywords = ["suicide", "self-harm", "end my life", "kill myself", "want to die"]
        if any(keyword in req.message.lower() for keyword in crisis_keywords):
            crisis_message = """
            It sounds like you're going through a very difficult time. I am a chatbot and not equipped to handle
            crisis situations. Please, reach out to a professional immediately.

            Here are some resources that can help right now:
            - **National Suicide Prevention Lifeline:** 988
            - **Crisis Text Line:** Text HOME to 741741
            - **Your university's counseling services**

            Your well-being is important. Please connect with a person who can provide immediate support.
            """
            return ChatResponse(reply=crisis_message, is_crisis_response=True)

        # Send the user's message to the Gemini chat session.
        # The session automatically sends the entire conversation history.
        response = global_chat_session.send_message(
            req.message,
            safety_settings=safety_settings
        )

        # Return the AI's response.
        return ChatResponse(reply=response.text)

    except Exception as e:
        # Log the error for debugging purposes
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing your request.")

    except Exception as e:
        return {"reply": f"Error: {str(e)}"}


# from fastapi import APIRouter
# from pydantic import BaseModel
# import os
# from google import genai

# router = APIRouter()

# class ChatRequest(BaseModel):
#     message: str

# # Initialize Gemini client
# client = genai.Client(api_key=os.getenv("GENAI_API_KEY"))

# @router.post("/chat")
# async def chat(req: ChatRequest):
#     try:
#         response = client.models.generate_content(
#             model="gemini-2.5-flash",
#             contents=req.message,
#         )
#         return {"reply": response.text}
#     except Exception as e:
#         return {"reply": f"Error: {str(e)}"}


