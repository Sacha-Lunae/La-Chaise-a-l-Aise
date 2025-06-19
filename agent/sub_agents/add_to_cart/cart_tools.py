def add_product(
        product_id: str,
        product_name: str,
        quantity: int = 1,
        ) -> dict:
    """Adds the specified product to the basket in the specified quantity.

    Args : 
        product_id : The ID of the product to add.
        product_name : The name of the product to add.
        quantity : The quantity of the product to add. Defaults to 1.

    Returns :
        A dictionary containing the ticket data:
        {'status': 'success', 'ticket_data': '...'}
    """

    # MOCK API RESPONSE
    try:

        return {
            'status': "success",
            'product_id': product_id,
            'product_name': product_name,
            'quantity': int(quantity) if quantity > 0 else 1}

    except Exception as e:
        return {"status": "error", "message": str(e)}
