from setuptools import setup, find_packages

setup(
    name='hackaton-agent-test', # Nom de ton package
    version='0.1.0',
    packages=find_packages(), # Trouve tous les dossiers contenant un __init__.py
    # Dépendances nécessaires à l'exécution de ton agent, y compris ADK, Vertex AI, etc.
    install_requires=[
        "google-adk",
        "vertexai",
        "google-cloud-aiplatform",
        "google-generativeai",
        "google-cloud-storage",
        "google-cloud-bigquery",
        # Ajoute toutes les autres libs Python que ton agent utilise (ex: pandas, requests, etc.)
    ],
    python_requires='>=3.9,<=3.12', # Assure-toi que cela correspond à ta version
)