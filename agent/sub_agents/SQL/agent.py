import logging
import warnings
from google.adk import Agent
from ...config import Config
from .prompts import create_sql_prompt
from ...shared_libraries.callbacks import (
    rate_limit_callback,
    before_agent,
    before_tool,
)

warnings.filterwarnings("ignore", category=UserWarning, module=".*pydantic.*")

configs = Config()

logger = logging.getLogger(__name__)


sql_generator_agent = Agent(
    model="gemini-2.0-flash-001",
    global_instruction="You help a customer of Maisons du Monde to choose a chair.",
    instruction=create_sql_prompt(),
    name="sql_agent",
    before_tool_callback=before_tool,
    before_agent_callback=before_agent,
    before_model_callback=rate_limit_callback,
)
