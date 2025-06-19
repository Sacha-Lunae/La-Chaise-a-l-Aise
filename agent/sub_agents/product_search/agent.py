# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.§

"""Agent module for the customer service agent."""

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


service_demand_agent = Agent(
    model="gemini-2.0-flash-001",
    global_instruction="You help an employee of Maisons du Monde with diverse tasks.",
    instruction=agent_prompt(),
    name="product_search_agent",
    tools=[
        product_similarity
    ],
    before_tool_callback=before_tool,
    before_agent_callback=before_agent,
    before_model_callback=rate_limit_callback,
)
