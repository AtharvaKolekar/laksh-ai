from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import *
from .serializers import *
import google.generativeai as genai
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from load_creds import load_creds

creds = load_creds()
genai.configure(credentials=creds)

generation_config = {
    "temperature": 0.9,
    "top_p": 1,
    "top_k": 0,
    "max_output_tokens": 8192,
}

safety_settings = []

model = genai.GenerativeModel(
    model_name="tunedModels/careerai-v6bv21gg17c6",
    generation_config=generation_config,
    safety_settings=safety_settings
)

@api_view(['POST'])
def post_career(request):
    data = request.data
    serializer = CareerSerializer(data=request.data)

    if serializer.is_valid():
        # Get user inputs
        specialization = request.data.get('specialization')
        interest = request.data.get('interest')
        skills = request.data.get('skills')
        certification = request.data.get('certification')

        # Construct conversation for the model
        conversation = [
            "system: You are a helpful assistant. Ask the user for their UG specialization, interests, skills, and certifications one by one and provide 3 more career roles similar to the recommended role (total 4 roles and 1st one should be the most precise). Don't mention 'role' in the response.",
            f"user: What is your UG specialization?: {specialization}",
            f"user: What are your interests?: {interest}",
            f"user: What are your skills? (Select multiple if necessary): {skills}",
            f"user: Do you have any certifications?: {certification}"
        ]

        # Generate response from the model
        response = model.generate_content(conversation)
        
        # Parse the response text into a list of roles
        recommended_roles = []
        for role in response.text.split('\n'):
            if role.strip():
                parts = role.split('. ', 1)
                if len(parts) == 2:
                    recommended_roles.append(parts[1].strip())

        # Save user profile with the recommendation
        career = serializer.save(recommended_role=recommended_roles)

        return Response(recommended_roles, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
