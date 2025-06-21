import logging
import warnings
from google.adk import Agent
from ...config import Config
from .prompts import agent_prompt
from ...shared_libraries.callbacks import (
    rate_limit_callback,
    before_agent,
    before_tool,
)
from .product_search_tools import (
    product_similarity
)

warnings.filterwarnings("ignore", category=UserWarning, module=".*pydantic.*")

configs = Config()

# configure logging __name__
logger = logging.getLogger(__name__)


product_similarity_agent = Agent(
    model="gemini-2.0-flash-001",
    global_instruction="You help an employee of Maisons du Monde with diverse tasks.",
    instruction=agent_prompt(),
    name="product_similarity_agent",
    tools=[
        product_similarity
    ],
    before_tool_callback=before_tool,
    before_agent_callback=before_agent,
    before_model_callback=rate_limit_callback,
)
