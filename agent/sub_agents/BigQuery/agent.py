import logging
import warnings
from google.adk import Agent
# from google.adk.agents.llm_agent import LlmAgent
from google.genai import types
from ...config import Config
from ...shared_libraries.callbacks import (
    rate_limit_callback,
    before_agent,
    before_tool,
)
from .tools import (
    connector_tool
)

warnings.filterwarnings("ignore", category=UserWarning, module=".*pydantic.*")

configs = Config()

# configure logging __name__
logger = logging.getLogger(__name__)

bq_executor_agent = Agent(
    model="gemini-2.0-flash",
    global_instruction=(
        "You are a backend agent designed to execute SQL queries on BigQuery and return results as structured JSON. Your responses will be processed by other systems."
    ),
    instruction=(
        "Use the BigQuery connector tool to execute the SQL query passed to you."
    ),
    name="big_query_agent",
    tools=[connector_tool],
    before_tool_callback=before_tool,
    before_agent_callback=before_agent,
    before_model_callback=rate_limit_callback,
    generate_content_config=types.GenerateContentConfig(temperature=0.2)
)
