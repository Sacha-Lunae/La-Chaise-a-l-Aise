# from google.adk.tools import google_search
import logging
import warnings
from google.adk import Agent
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

bq_agent = Agent(
    model="gemini-2.0-flash-001",
    global_instruction="You help an employee of Maisons du Monde with diverse tasks.",
    instruction="Use the BigQuery connector to help the user.",
    name="big_query_agent",
    tools=connector_tool.get_tools(),
    before_tool_callback=before_tool,
    before_agent_callback=before_agent,
    before_model_callback=rate_limit_callback,
)