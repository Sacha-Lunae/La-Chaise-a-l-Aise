import logging
import time

from google.adk.agents.callback_context import CallbackContext
from google.adk.models import LlmRequest
from typing import Any, Dict
from google.adk.tools import BaseTool
from google.adk.agents.invocation_context import InvocationContext
from agent.entities.customer import Customer

from agent.shared_libraries.image_tools import extract_image_part, upload_image_to_gcs

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

RATE_LIMIT_SECS = 60
RPM_QUOTA = 10


def rate_limit_callback(
    callback_context: CallbackContext, llm_request: LlmRequest
) -> None:
    """Callback function that implements a query rate limit. Ensures the agent pauses if the number of requests
    exceeds the quota within a certain time period.

    Args:
      callback_context: A CallbackContext obj representing the active callback
        context.
      llm_request: A LlmRequest obj representing the active LLM request.
    """
    for content in llm_request.contents:
        for part in content.parts:
            if part.text == "":
                part.text = " "

    now = time.time()
    if "timer_start" not in callback_context.state:

        callback_context.state["timer_start"] = now
        callback_context.state["request_count"] = 1
        logger.debug(
            "rate_limit_callback [timestamp: %i, req_count: 1, elapsed_secs: 0]",
            now,
        )
        return

    request_count = callback_context.state["request_count"] + 1
    elapsed_secs = now - callback_context.state["timer_start"]
    logger.debug(
        "rate_limit_callback [timestamp: %i, request_count: %i, elapsed_secs: %i]",
        now,
        request_count,
        elapsed_secs,
    )

    if request_count > RPM_QUOTA:
        delay = RATE_LIMIT_SECS - elapsed_secs + 1
        if delay > 0:
            logger.debug("Sleeping for %i seconds", delay)
            time.sleep(delay)
        callback_context.state["timer_start"] = now
        callback_context.state["request_count"] = 1
    else:
        callback_context.state["request_count"] = request_count

    return


def lowercase_value(value):
    """Recursively lowercases all string values in a dictionary or list.
    """
    if isinstance(value, dict):
        return (dict(k, lowercase_value(v)) for k, v in value.items())
    elif isinstance(value, str):
        return value.lower()
    elif isinstance(value, (list, set, tuple)):
        tp = type(value)
        return tp(lowercase_value(i) for i in value)
    else:
        return value


def before_tool(
    tool: BaseTool, args: Dict[str, Any], tool_context: CallbackContext
):
    """
    Callback before a tool is called. Transforms all input args to lowercase.
    """
    lowercase_value(args)


def before_agent(callback_context: InvocationContext):
    """
    Ensures a customer profile is loaded into state before the agent runs.
    Also extracts and uploads any image in the original request to GCS.
    """
    if "customer:profile" not in callback_context.state:
        callback_context.state["customer:profile"] = Customer.get_customer("123").to_json()

    logger.info("Loaded customer profile: %s", callback_context.state["customer:profile"])

    # try:
    #     if hasattr(callback_context, "original_request") and callback_context.original_request:
    #         image_bytes = extract_image_part(callback_context.original_request)
    #         if image_bytes:
    #             gcs_uri = upload_image_to_gcs(image_bytes)
    #             callback_context.state["uploaded_image_gcs_uri"] = gcs_uri
    #             logger.info(f"Image uploaded successfully: {gcs_uri}")
    #         else:
    #             logger.info("No image found in user request.")
    #     else:
    #         logger.warning("No original_request found in callback_context.")
    # except Exception as e:
    #     logger.warning(f"Image upload failed: {e}")


def before_model(callback_context: CallbackContext, llm_request: LlmRequest) -> None:
    # Rate limiting logic
    logger.info("Starting rate_limit_callback")
    rate_limit_callback(callback_context, llm_request)
    logger.info("Finished rate_limit_callback")

    # Image upload logic
    try:
        if llm_request:
            logger.info("Attempting to upload image to GCS...")
            image_bytes = extract_image_part(llm_request)
            if image_bytes:
                logger.info("Image bytes extracted, uploading...")
                gcs_uri = upload_image_to_gcs(image_bytes)
                logger.info(f"Uploaded image to GCS: {gcs_uri}")
                callback_context.state["uploaded_image_gcs_uri"] = gcs_uri
                logger.info(f"Image uploaded successfully: {gcs_uri}")
            else:
                logger.info("No image found in user request.")
        else:
            logger.warning("No original_request found in callback_context.")
    except Exception as e:
        logger.warning(f"Image upload failed: {e}")
