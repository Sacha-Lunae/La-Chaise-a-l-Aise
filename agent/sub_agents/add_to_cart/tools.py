from google.adk.tools.tool_context import ToolContext


def add_product(
    product_id: str,
    product_name: str,
    in_stock: bool = True,
    quantity: int = 1,
    tool_context: ToolContext = None
) -> dict:
    """
    Adds a product to the customer's basket, stored in agent state.
    """

    if not in_stock:
        return {"status": "error", "message": "Product not available in stock"}

    profile = tool_context.state.get("customer:profile", {})

    import json
    if isinstance(profile, str):
        try:
            profile = json.loads(profile)
        except json.JSONDecodeError:
            return {"status": "error", "message": "Could not load customer profile."}

    basket = profile.get("basket", [])

    # Check if product is already in basket
    for item in basket:
        if item["product_id"] == product_id:
            item["quantity"] += quantity
            break
    else:
        basket.append({
            "product_id": product_id,
            "label": product_name,
            "quantity": quantity,
            "unit_price": 0.0,
        })

    profile["basket"] = basket
    tool_context.state["customer:profile"] = profile

    return {
        "status": "success",
        "product_id": product_id,
        "product_name": product_name,
        "quantity_added": quantity,
        "current_basket": basket
    }


def is_product_in_stock(product_id: str) -> dict:
    """
    Mock function to check if a product is available in stock.
    """

    return {"product_id": product_id, "in_stock": True}
