from google.adk.tools import google_search
from google.adk.tools.agent_tool import AgentTool
import logging
import warnings
from google.adk import Agent
from .prompts import agent_prompt
from agent.shared_libraries.config import Config
from agent.shared_libraries.callbacks import (
    rate_limit_callback,
    before_agent,
    before_tool,
)
from agent.sub_agents.BigQuery.agent import bq_agent
from agent.sub_agents.Rag.agent import rag_agent
from agent.sub_agents.service_demand.agent import service_demand_agent
from .tools import get_user_profile, update_user_profile

warnings.filterwarnings("ignore", category=UserWarning, module=".*pydantic.*")

configs = Config()

# configure logging __name__
logger = logging.getLogger(__name__)  

# On initie ici rapidement un sub agent pour les recherches google
search_agent = Agent(
    name = "google_search_agent",
    model=configs.agent_settings.model,
    global_instruction="You help an employee of Maisons du Monde with diverse tasks.",
    instruction="Your job is to provide info from scopes outside Maisons du Monde. Always cite your source.",
    tools=[google_search],
    output_key="search_results"
)

root_agent = Agent(
    model=configs.agent_settings.model,
    global_instruction="You help an employee of Maisons du Monde with diverse tasks.",
    instruction=agent_prompt(),
    name=configs.agent_settings.name,
    tools=[
           AgentTool(agent= bq_agent),
           AgentTool(agent = service_demand_agent),
           AgentTool(agent = rag_agent),
           AgentTool(agent = search_agent),
           get_user_profile,
           update_user_profile],
    before_tool_callback=before_tool,
    before_agent_callback=before_agent,
    before_model_callback=rate_limit_callback,
)