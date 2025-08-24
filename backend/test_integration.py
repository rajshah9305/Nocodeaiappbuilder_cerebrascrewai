import httpx
import json

# This is a sample request that mimics the frontend's GenerationRequest.
# In a real test suite, this would be more comprehensive.
sample_request = {
    "prompt": "Create a simple to-do list application using React.",
    "template": "react-basic",
    "agents": [
        {
            "id": "agent-1",
            "name": "React Engineer",
            "role": "Senior React Engineer",
            "goal": "Create a functional and clean React application.",
            "backstory": "You are an expert in React and have built many applications.",
            "tools": [],
            "status": "ready",
            "avatar": "avatar1.png",
            "expertise": 9,
            "completedTasks": 0
        },
        {
            "id": "agent-2",
            "name": "Code Reviewer",
            "role": "Lead Code Reviewer",
            "goal": "Ensure the code is high quality and bug-free.",
            "backstory": "You are a meticulous code reviewer with an eye for detail.",
            "tools": [],
            "status": "ready",
            "avatar": "avatar2.png",
            "expertise": 8,
            "completedTasks": 0
        }
    ],
    "options": {
        "model": "llama-4-maverick-17b-128e-instruct",
        "maxTokens": 8192,
        "temperature": 0.7,
        "includeTests": True,
        "includeDocumentation": True,
        "deploymentTarget": "vercel"
    }
}

def run_test():
    """
    Sends a test request to the running FastAPI application.
    """
    # Note: To run this test, the FastAPI server must be running.
    # You can run it with: uvicorn backend.main:app --reload
    base_url = "http://127.0.0.1:8000"
    endpoint = "/v1/orchestrate"
    url = f"{base_url}{endpoint}"

    print(f"Sending POST request to {url}")
    print("Request body:")
    print(json.dumps(sample_request, indent=2))

    try:
        with httpx.Client() as client:
            response = client.post(url, json=sample_request, timeout=300) # Long timeout for AI generation

        print("\nResponse from server:")
        print(f"Status code: {response.status_code}")

        if response.status_code == 200:
            print("Response JSON:")
            print(response.json())
        else:
            print("Error response:")
            print(response.text)

    except httpx.RequestError as e:
        print(f"\nAn error occurred while sending the request: {e}")
        print("Please ensure the FastAPI server is running.")

if __name__ == "__main__":
    run_test()
