from google.adk.tools.tool_context import ToolContext
from pydantic import BaseModel
import json


class CustomerProfileUpdate(BaseModel):
    field: str
    value: str


def get_customer_profile(tool_context: ToolContext) -> dict:
    """
    Retrieves the customer's stored profile information.

    Args:
        tool_context: Provided automatically by ADK.

    Returns:
        dict: The customer's profile data and returning user status.
    """
    profile = tool_context.state.get("customer:profile", {})

    return {
        "status": "success",
        "profile": profile,
        "is_returning_user": bool(profile)
    }


def update_customer_profile(update: CustomerProfileUpdate, tool_context: ToolContext) -> dict:
    """
    Updates a specific field in the customer's profile.

    Args:
        field: The profile field to update (e.g., "first_name", "loyalty_tier").
        value: The value to assign to that field.
        tool_context: Provided automatically by ADK.

    Returns:
        dict: Status of the update operation.
    """
    profile = tool_context.state.get("customer:profile", {})

    import json
    if isinstance(profile, str):
        try:
            profile = json.loads(profile)
        except json.JSONDecodeError:
            return {"status": "error", "message": "Invalid profile format"}

    profile[update.field] = update.value
    tool_context.state["customer:profile"] = profile

    return {
        "status": "success",
        "field": update.field,
        "value": update.value
    }