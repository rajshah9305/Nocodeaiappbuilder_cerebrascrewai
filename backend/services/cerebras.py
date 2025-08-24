import os
from cerebras.cloud.sdk import Cerebras
from backend.config import settings


class CerebrasService:
    def __init__(self):
        if not settings.cerebras_api_key or settings.cerebras_api_key == "YOUR_CEREBRAS_API_KEY":
            raise ValueError("Cerebras API key not found. Please set it in your .env file.")

        self.client = Cerebras(
            api_key=settings.cerebras_api_key,
            base_url="https://api.cerebras.ai/v1"
        )

    def get_completion(self, prompt: str):
        try:
            completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert software engineer."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model="llama-4-maverick-17b-128e-instruct",
                max_tokens=32768,
                temperature=0.6,
                top_p=0.9
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"An error occurred while communicating with Cerebras API: {e}")
            return None
