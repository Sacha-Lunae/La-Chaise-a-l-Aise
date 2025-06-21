from __future__ import annotations
import pandas as pd
import requests
import json
from google.auth import default
from google.auth.transport.requests import Request


def product_similarity(input_image_link: str):
    """
    Fonction qui appelle l'API avec le product set 2, récupère le classement des produits les plus similaires et leur score.
    Ne retourne que 
    """
    try:

        response_text = get_mkp_products(input_image_link)

        df_output = quick_parse(response_text)

        list_similar_products = list(df_output["product"])

        return {"status": "success", "similar_products": list_similar_products}

    except Exception as e:  # Catch-all to avoid crashing the caller
        return {"status": "error", "message": str(e)}


def get_json(link):
    """
    Fonction qui génère la requète au format Json
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
            "productSet": "projects/mdm-data-prod/locations/europe-west1/productSets/product_set2",
            "productCategories": [
              "homegoods-v2"
            ],
            "filter": ""
          }
        }
      }
    ]
    }


def get_mkp_products(link):

    """
    Interroge l'API Google Cloud Vision AI Product Search pour trouver des produits similaires à une image GCS.
    Gère l'authentification Google Cloud, construit et envoie la requête API.
    Args:
        link (str): URI Google Cloud Storage (GCS) de l'image.

    Returns:
        str: Réponse JSON brute de l'API Google Cloud Vision.
    """
    
    url = "https://vision.googleapis.com/v1/images:annotate"

    credentials, project = default()

    credentials.refresh(Request())
    access_token = credentials.token

    headers = {
        "Authorization": f"Bearer {access_token}",
        "x-goog-user-project": "mdm-data-prod",
        "Content-Type": "application/json; charset=utf-8"
    }

    data = get_json(link)
    response = requests.post(url, headers=headers, json=data, timeout=(5, 30))

    return response.text


def quick_parse(response_text):
    """
    Analyse une chaîne JSON de résultats de recherche de produits en un DataFrame pandas.

    Extrait l'id produit, le classement et le score de similarité des produits.

    Args:
        response_text (str): Chaîne JSON des résultats de recherche.

    Returns:
        pd.DataFrame: DataFrame avec les colonnes 'product', 'ranking', 'similarity_score'.
                      Retourne un DataFrame vide si la structure n'est pas trouvée.


    """
    data = json.loads(response_text)

    results_data = []
    ranking = 1

    for response in data.get('responses', []):
        for result in response.get('productSearchResults', {}).get('results', []):
            if 'product' in result and 'displayName' in result['product']:
                results_data.append({
                    'product': result['product']['displayName'],
                    'ranking': ranking,
                    'similarity_score': result.get('score', 0.0)
                })
                ranking += 1

    return pd.DataFrame(results_data)