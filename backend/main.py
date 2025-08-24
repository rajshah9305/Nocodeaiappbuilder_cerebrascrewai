from fastapi import FastAPI, APIRouter, HTTPException
from backend.models import GenerationRequest, GenerationResponse
from backend.services.crew import run_crew

app = FastAPI(
    title="AI App Builder Pro - CrewAI Backend",
    description="This backend provides AI-powered application generation using CrewAI and Cerebras.",
    version="1.0.0",
)

router_v1 = APIRouter(prefix="/v1")


@router_v1.post("/orchestrate", response_model=GenerationResponse)
def orchestrate_crew(request: GenerationRequest):
    """
    Orchestrates the CrewAI agents to generate an application.
    """
    if not request.prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    try:
        # Note: This can be a long-running process.
        # For a production system, we would use a task queue like Celery or ARQ.
        result = run_crew(request)

        # For now, we'll return a dummy GenerationResponse.
        # We will implement the actual response generation in the next step.
        return GenerationResponse(
            success=True,
            code=result,
            preview="<p>Preview will be generated here.</p>",
            metadata={
                "generationTime": 5000,
                "tokenUsage": 1000,
                "complexity": "medium",
                "frameworks": ["React"],
                "features": ["Login", "Dashboard"]
            }
        )

    except Exception as e:
        # Log the error for debugging purposes
        print(f"An error occurred during crew execution: {e}")
        raise HTTPException(status_code=500, detail="An unexpected error occurred during app generation.")


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(router_v1)
