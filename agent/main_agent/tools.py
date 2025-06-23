from google.adk.tools.tool_context import ToolContext

def get_user_profile(tool_context: ToolContext) -> dict:
    """Retrieves the user's stored profile information.
    
    Args:
        tool_context: Automatically provided by ADK.
        
    Returns:
        dict: The user's profile data.
    """
    profile = tool_context.state.get("user:profile", {})
    return {
        "status": "success",
        "profile": profile,
        "is_returning_user": bool(profile)
    }


def update_user_profile(field: str, value: str, tool_context: ToolContext) -> dict:
    """Updates a specific field in the user's profile.
    
    Args:
        field: The profile field to update (e.g., "name", "occupation").
        value: The value to store.
        tool_context: Automatically provided by ADK.
        
    Returns:
        dict: Status of the operation.
    """
    profile = tool_context.state.get("user:profile", {})
    
    # S'assurer que profile est un dictionnaire
    if isinstance(profile, str):
        try:
            # Si c'est une chaîne JSON, essayer de la convertir
            import json
            profile = json.loads(profile)
        except json.JSONDecodeError:
            # Si la conversion échoue, initialiser un nouveau dictionnaire
            return {"status": "error - no profile found"}
    
    profile[field] = value
    tool_context.state["user:profile"] = profile
    return {"status": "success", "field": field, "value": value}