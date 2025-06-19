from google.adk.tools.application_integration_tool.application_integration_toolset import ApplicationIntegrationToolset
from .prompts import get_bq_prompt

connector_tool = ApplicationIntegrationToolset(
    project="data-sandbox-410808",
    location="europe-west1",
    connection="bq-test-adk",
    entity_operations={"datascience_playground.extract-products-adk": ["LIST"]},
    # service_account_credentials="datasience-sa@data-sandbox-410808.iam.gserviceaccount.com",
    # tool_name="bq_tool",
    tool_instructions=get_bq_prompt()
)