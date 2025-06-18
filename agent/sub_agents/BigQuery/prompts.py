def get_bq_prompt():
    return """
            Use the table datascience_playground.extract_products_adk to guide the user on what products are available. 
            Every product in the table is available.
            The schema is :
            - product_id : int
            - label : str, the name of the product
            - family : str,
            - subfamily : str,
            - subsubfamily : str
            
            If you have a doubt on wether to query the sub family or the subsub family according to 
            the user's request, you can select everything without a problem.
            
            If you do not have the permissions to query the table, be VERY PRECISE regarding the error you got.
            Be as exhaustive as possible on the error."""
