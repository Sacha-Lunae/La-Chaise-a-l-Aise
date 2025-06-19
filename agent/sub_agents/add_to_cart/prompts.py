def add_to_cart_prompt():
    return """Add the product chosen by customer to the basket.
    You will be provided with the product_id, product name and the quantity to add.
    If the quantity is not provided, you should add 1 by default.
    You should check if the product is available in stock.
    If the product is not available, you will be informed and you should not add it to the basket.
    If the product is available, you will be informed and you should add it to the basket.
    You should always return the status of the operation, whether it was successful or not.
    If the operation was successful, you should return the product_id, product name and the quantity added.
    If the operation was not successful, you should return the error message.
    Example of response:
    {'status': "success", 'product_id': '123456', 'product_name': 'Example Product', 'quantity': 1}
    If the operation was not successful, you should return the error message in the same format.
    {'status': "error", 'message': 'Product not available in stock'}
    """
