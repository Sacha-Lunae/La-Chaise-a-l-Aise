from google.adk.tools import google_search
from google.adk.tools.agent_tool import AgentTool

import logging
import warnings
from google.adk import Agent
from .prompts import agent_prompt
from .config import Config
from .shared_libraries.callbacks import (
    # rate_limit_callback,
    before_agent,
    before_tool,
    before_model,
)
# from .shared_libraries.image_tools import (
#     extract_image_part,
#     upload_image_to_gcs
# )
from .sub_agents.SQL.agent import sql_generator_agent
from .sub_agents.BigQuery.agent import bq_executor_agent
from .sub_agents.Rag.agent import rag_agent
from .sub_agents.add_to_cart.agent import add_to_cart_agent
from .tools import get_customer_profile, update_customer_profile

warnings.filterwarnings("ignore", category=UserWarning, module=".*pydantic.*")

configs = Config()

# configure logging __name__
logger = logging.getLogger(__name__)  

# On initie ici rapidement un sub agent pour les recherches google
search_agent = Agent(
    name="google_search_agent",
    model=configs.agent_settings.model,
    global_instruction="You help a customer of Maisons du Monde to choose furniture and decoration products.",
    instruction="Your job is to provide info from scopes outside Maisons du Monde. Stay focused on the furniture and decoration topics, ignore not related questions.  Always cite your source.",
    tools=[google_search],
    output_key="search_results"
)

root_agent = Agent(
    model=configs.agent_settings.model,
    global_instruction="You help a customer of Maisons du Monde to choose and purchase furniture and decoration products.",
    instruction=agent_prompt(),
    name=configs.agent_settings.name,
    tools=[
           AgentTool(agent=sql_generator_agent),
           AgentTool(agent=bq_executor_agent),
           AgentTool(agent=add_to_cart_agent),
           AgentTool(agent=rag_agent),
           AgentTool(agent=search_agent),
           get_customer_profile,
           update_customer_profile
           ],
    before_tool_callback=before_tool,
    before_agent_callback=before_agent,
    # before_model_callback=rate_limit_callback,
    before_model_callback=before_model,
)