from google.adk.models import LlmRequest
# from google.adk.tools.tool_context import ToolContext
from typing import Optional
import logging

from google.cloud import storage
import uuid

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

# import requests
# import json
# from google.auth import default
# from google.auth.transport.requests import Request


def extract_image_part(llm_request: LlmRequest) -> Optional[bytes]:
    """
    Extract the first image part from the LLM request.

    Returns:
        Image bytes if found, else None.
    """
    for content in llm_request.contents:
        for part in content.parts:
            if getattr(part, "inline_data", None) and getattr(part.inline_data, "mime_type", "").startswith("image/"):
                logger.info(f"Image bytes found: {len(part.inline_data.data)} bytes")
                return part.inline_data.data  # Bytes
    logger.info("No image bytes found in the request.")
    return None


def upload_image_to_gcs(image_bytes: bytes, bucket_name: str = "hackathon-adk-images", prefix: str = "uploads/") -> str:
    """
    Uploads an image to Google Cloud Storage and returns the public GCS URI.

    Args:
        image_bytes (bytes): The raw image data.
        bucket_name (str): The name of your GCS bucket.
        prefix (str): The folder path inside the bucket.

    Returns:
        str: GCS URI (gs://...) of the uploaded image.
    """
    # Create a unique file name
    image_id = str(uuid.uuid4())
    file_name = f"{prefix}{image_id}.jpg"

    # Initialize the client and upload the file
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(file_name)

    blob.upload_from_string(image_bytes, content_type="image/jpeg")

    # Return GCS URI or HTTPS public URL depending on your needs
    return f"gs://{bucket_name}/{file_name}"
