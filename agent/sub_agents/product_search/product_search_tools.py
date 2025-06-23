"""IMPORTANT : this file only has an informative purpose and is not used in the codebase.
We already deployed the ADK agent, therefore we'll anonymise our project names and buckets here."""

from __future__ import annotations
import requests
import json
from google.auth import default
from google.auth.transport.requests import Request
from google.adk.tools.tool_context import ToolContext
import logging


def product_similarity(tool_context: ToolContext) -> dict:
    """
    Calls the Vision Product Search API with the uploaded image's GCS URI
    stored in the callback_context.state.
    """
    logging.info("[Product Similarity Tool] Invoked.")

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
            "productSet": "OUR PRODUCT SET",
            "productCategories": [
              "homegoods-v2"
            ],
            "filter": "product_brand=MDM"
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
        "x-goog-user-project": "OUR PROJECT",
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
