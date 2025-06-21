from __future__ import annotations
import requests
import json
from google.auth import default
from google.auth.transport.requests import Request
from google.adk.tools.tool_context import ToolContext

from google.cloud import storage
from ...config import Config

import logging


def product_similarity(tool_context: ToolContext) -> dict:
    """
    Calls the Vision Product Search API with the uploaded image's GCS URI
    stored in the callback_context.state, and then deletes the image.
    """
    logging.info("[Product Similarity Tool] Invoked.")
    gcs_uri = None

    try:
        logging.info(f"[Product Similarity Tool] tool_context.state contents: {tool_context.state}")

        # Extract GCS URI from state
        gcs_uri = tool_context.state.get("uploaded_image_gcs_uri")
        logging.info(f"[Product Similarity Tool] GCS URI received: {gcs_uri}")

        if not gcs_uri:
            return {"status": "error", "message": "No uploaded image found in context."}

        response_text = get_mkp_products(gcs_uri)
        logging.info(f"[Product Similarity Tool] API raw response: {response_text}")

        list_similar_products = quick_parse(response_text)
        logging.info(f"[Product Similarity Tool] Parsed similar products: {list_similar_products}")

        return {"status": "success", "similar_products": list_similar_products}

    except Exception as e:
        logging.exception("[Product Similarity Tool] Exception occurred:")
        return {"status": "error", "message": str(e)}
    finally:
        if gcs_uri:
            _delete_gcs_blob(gcs_uri)


def _delete_gcs_blob(gcs_uri: str):
    """Deletes a blob from the given GCS URI."""
    if not gcs_uri or not gcs_uri.startswith("gs://"):
        logging.warning(f"Invalid or missing GCS URI for deletion: {gcs_uri}")
        return

    try:
        storage_client = storage.Client()
        # The gcs_uri is in the format gs://<bucket_name>/<blob_name>
        bucket_name, blob_name = gcs_uri.replace("gs://", "").split("/", 1)
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(blob_name)
        blob.delete()
        logging.info(f"Blob {gcs_uri} deleted successfully.")
    except Exception as e:
        logging.exception(f"Failed to delete blob {gcs_uri}: {e}")


def get_json(link):
    """
    Generates the request in JSON format.

    Args:
        link (str): GCS URI of the image.
    """
    return {"requests": [
      {
        "image": {
          "source": {
            "gcsImageUri": link
            }
        },
        "features": [
          {
            "type": "PRODUCT_SEARCH",
            "maxResults": 10
          }
        ],
        "imageContext": {
          "productSearchParams": {
            "productSet": Config().product_search_settings.product_set_uri,
            "productCategories": [
              *Config().product_search_settings.product_categories
            ],
            "filter": Config().product_search_settings.product_filter
          }
        }
      }
    ]
    }


def get_mkp_products(link):

    """
    Queries the Google Cloud Vision AI Product Search API to find products similar to a GCS image.
    Handles Google Cloud authentication, builds, and sends the API request.

    Args:
        link (str): Google Cloud Storage (GCS) URI of the image.

    Returns:
        str: Raw JSON response from the Google Cloud Vision API.
    """

    url = "https://vision.googleapis.com/v1/images:annotate"

    credentials, project = default()

    credentials.refresh(Request())
    access_token = credentials.token

    headers = {
        "Authorization": f"Bearer {access_token}",
        "x-goog-user-project": Config().product_search_settings.google_user_project,
        "Content-Type": "application/json; charset=utf-8"
    }

    data = get_json(link)
    response = requests.post(url, headers=headers, json=data, timeout=(5, 30))

    return response.text


def quick_parse(response_text):
    """
    Parses a JSON string of product search results into a list of product names.

    Extracts the product display name from the results.

    Args:
        response_text (str): JSON string of search results.

    Returns:
        list[str]: A list of product display names.
                   Returns an empty list if the structure is not found.
    """
    data = json.loads(response_text)

    product_names = []
    for response in data.get('responses', []):
        for result in response.get('productSearchResults', {}).get('results', []):
            if 'product' in result and 'displayName' in result['product']:
                product_names.append(result['product']['displayName'])

    return product_names
