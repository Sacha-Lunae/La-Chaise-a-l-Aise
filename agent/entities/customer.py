from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class Purchase(BaseModel):
    """
    Represents a previous purchase made by the customer.
    """
    product_id: str
    label: str
    quantity: int
    purchase_date: str
    eur_regular_price: float
    review_left: bool
    model_config = ConfigDict(from_attributes=True)


class BasketItem(BaseModel):
    """
    Represents a product currently in the customer's shopping basket.
    """
    product_id: str
    label: str
    quantity: int
    unit_price: float
    model_config = ConfigDict(from_attributes=True)


class Customer(BaseModel):
    """
    Represents a customer interacting with the chair shopping assistant.
    """
    customer_id: str
    first_name: str
    last_name: str
    email: str
    preferred_language: str
    loyalty_status: Optional[str]
    last_login: Optional[str]
    purchase_history: List[Purchase]
    basket: List[BasketItem]

    model_config = ConfigDict(from_attributes=True)

    def to_json(self) -> str:
        """
        Converts the customer object to a JSON string.
        """
        return self.model_dump_json(indent=4)

    @staticmethod
    def get_customer(current_customer_id: str) -> Optional["Customer"]:
        """
        Retrieves a customer by ID (mock implementation).
        """
        return Customer(
            customer_id=current_customer_id,
            first_name="Sophie",
            last_name="Martin",
            email="sophie.martin@example.com",
            preferred_language="en",
            loyalty_status="Gold",
            last_login="2025-06-18T15:27:00Z",
            purchase_history=[
                Purchase(
                    product_id="234579",
                    label="CHS BUR MAURICETTE TERRA PD G",
                    quantity=1,
                    purchase_date="2024-11-22",
                    eur_regular_price=97.94,
                    review_left=True,
                ),
                Purchase(
                    product_id="238841",
                    label="CHS CLYDE GRIS ANTHRACITE_1",
                    quantity=2,
                    purchase_date="2025-01-05",
                    eur_regular_price=45.02,
                    review_left=False,
                )
            ],
            basket=[
                BasketItem(
                    product_id="197936",
                    label="CHS LUNA VEL OCRE",
                    quantity=2,
                    unit_price=99.59,
                ),
            ]
        )
