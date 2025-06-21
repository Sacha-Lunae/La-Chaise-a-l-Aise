from google.adk.tools.application_integration_tool.application_integration_toolset import ApplicationIntegrationToolset
from .prompts import get_bq_prompt

connector_tool = ApplicationIntegrationToolset(
    project="data-sandbox-410808",
    location="europe-west1",
    connection="bq-test-adk",
    entity_operations={
        "datascience_playground.extract_chairs_adk": ["LIST"],
        "datascience_playground.extract_chairs_reviews_adk": ["LIST"],},
    tool_instructions=get_bq_prompt()
)
