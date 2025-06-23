import logging
import warnings
from google.adk import Agent
from ...config import Config
from .prompts import add_to_cart_prompt
from ...shared_libraries.callbacks import (
    rate_limit_callback,
    before_agent,
    before_tool,
)
from .tools import add_product, is_product_in_stock

warnings.filterwarnings("ignore", category=UserWarning, module=".*pydantic.*")

configs = Config()

logger = logging.getLogger(__name__)

add_to_cart_agent = Agent(
    model="gemini-2.0-flash-001",
    global_instruction="You help a customer of Maisons du Monde to add a product to the basket.",
    instruction=add_to_cart_prompt(),
    name="add_to_cart_agent",
    tools=[add_product, is_product_in_stock],
    before_tool_callback=before_tool,
    before_agent_callback=before_agent,
    before_model_callback=rate_limit_callback,
)
