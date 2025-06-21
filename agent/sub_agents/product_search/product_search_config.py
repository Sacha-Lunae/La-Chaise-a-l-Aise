from pydantic import BaseModel, Field


class ProductSearchSettings(BaseModel):
    """Settings for the Vision Product Search API."""

    # Google Cloud Vision AI Product Search API settings
    product_set_uri: str = Field(
        default="projects/mdm-data-prod/locations/europe-west1/productSets/product_set2",
        description="URI of the product set to search within."
    )
    product_categories: list[str] = Field(
        default=["homegoods-v2"],
        description="List of product categories to filter by."
    )
    product_filter: str = Field(
        default="product_brand=MDM",
        description="Filter string for product search (e.g., 'product_brand=MDM')."
    )
    google_user_project: str = Field(
        default="mdm-data-prod",
        description="Google Cloud project ID to use for API requests (x-goog-user-project header)."
    )
