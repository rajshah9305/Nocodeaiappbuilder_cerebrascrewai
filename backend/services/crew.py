import os
from crewai import Agent, Task, Crew, Process
from crewai.llm import LLM
from backend.config import settings
from backend.models import GenerationRequest

# Configure the LLM to use Cerebras
# Note: In a real app, you might want to create the LLM object dynamically
# based on the model specified in the request.
cerebras_llm = LLM(
    model="llama-4-maverick-17b-128e-instruct",
    api_key=settings.cerebras_api_key,
    base_url="https://api.cerebras.ai/v1",
    temperature=0.7,
    max_tokens=32768,
    top_p=0.9,
)


def create_crew(request: GenerationRequest) -> Crew:
    """
    Creates a CrewAI crew based on the generation request.
    """
    # Create agents dynamically from the request
    agents = [
        Agent(
            role=agent_data.role,
            goal=agent_data.goal,
            backstory=agent_data.backstory,
            llm=cerebras_llm,
            allow_delegation=False, # Can be made dynamic
            verbose=True,
        )
        for agent_data in request.agents
    ]

    # For this version, let's assume the first agent is the engineer
    # and the second is the reviewer. A more robust implementation would
    # use agent roles or IDs to assign tasks.
    if len(agents) < 2:
        raise ValueError("The generation request must include at least two agents (engineer and reviewer).")

    engineer_agent = agents[0]
    reviewer_agent = agents[1]

    # Create tasks
    code_generation_task = Task(
        description=(
            f"Generate a complete application based on the following description: '{request.prompt}'. "
            "The application should be well-structured, with separate frontend and backend code if necessary. "
            "The output should be a single block of code that can be copied and pasted into files."
        ),
        expected_output="The complete code for the application, with clear file names and code blocks.",
        agent=engineer_agent,
    )

    code_review_task = Task(
        description=(
            "Review the generated code. Check for bugs, security vulnerabilities, and performance issues. "
            "Suggest improvements to the code structure, readability, and documentation. "
            "If the code is good, approve it and return the original code. If not, provide detailed feedback and return the improved code."
        ),
        expected_output="The final, reviewed, and approved code for the application.",
        agent=reviewer_agent,
    )

    return Crew(
        agents=agents,
        tasks=[code_generation_task, code_review_task],
        process=Process.sequential,
        verbose=True,
    )


def run_crew(request: GenerationRequest) -> str:
    """
    Runs the CrewAI crew and returns the result.
    """
    if not settings.cerebras_api_key or settings.cerebras_api_key == "YOUR_CEREBRAS_API_KEY":
        raise ValueError("Cerebras API key not configured.")

    crew = create_crew(request)
    result = crew.kickoff()
    return result
