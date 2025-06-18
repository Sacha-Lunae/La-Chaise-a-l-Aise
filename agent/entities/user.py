# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""User entity module."""

from typing import List, Dict, Optional
from pydantic import BaseModel, Field, ConfigDict


class Hierarchy(BaseModel):
    """
    Represents a user's manager and team they belong to.
    """

    manager: str
    team: str
    direction: str
    model_config = ConfigDict(from_attributes=True)


class ServiceDemand(BaseModel):
    """
    Represents a product in a user's service demands history.
    """

    service_name: str
    service_id: int
    date: str
    model_config = ConfigDict(from_attributes=True)


class Ticket(BaseModel):
    """
    Represents a user's tickets history.
    """

    ticket_name: str
    ticket_id: int
    ticket_description: str
    demand_date: str
    resolution_date: str
    operator : str
    model_config = ConfigDict(from_attributes=True)


class Permissions(BaseModel):
    """
    Represents a user's language and permissions.
    """

    language : str
    rh_perms : bool
    dsi_perms : bool
    siege_perms : bool
    mag_perms : bool
    supply_perms : bool
    model_config = ConfigDict(from_attributes=True)


class User(BaseModel):
    """
    Represents a user.
    """

    account_number: str
    user_id: str
    user_first_name: str
    user_last_name: str
    location: str
    email: str
    phone_number: str
    user_start_date: str
    years_as_user: int
    hierarchy: Hierarchy
    service_demands: List[ServiceDemand]
    tickets: List[Ticket]
    permissions: Permissions
    model_config = ConfigDict(from_attributes=True)

    def to_json(self) -> str:
        """
        Converts the user object to a JSON string.

        Returns:
            A JSON string representing the user object.
        """
        return self.model_dump_json(indent=4)

    @staticmethod
    def get_user(current_user_id: str) -> Optional["User"]:
        """
        Retrieves a user based on their ID.

        Args:
            user_id: The ID of the user to retrieve.

        Returns:
            The user object if found, None otherwise.
        """
        # In a real application, this would involve a database lookup.
        # For this example, we'll just return a dummy user.
        return User(
            user_id=current_user_id,
            account_number="20200689",
            user_first_name="Sacha",
            user_last_name="Guenoun",
            location="Siège",
            email="sguenoun@maisonsdumonde.com",
            phone_number="+1-702-555-1212",
            user_start_date="2022-06-10",
            years_as_user=2,
            hierarchy = Hierarchy(
                manager = "Emeline Daviau",
                team = "Data - Data Science",
                direction = "DSI",
            ),
            service_demands = [ServiceDemand(
                service_name = "Nouvelle clé Admin",
                service_id = 124,
                date = "04-11-2024",
            ),
                            ServiceDemand(
                service_name = "Accès Horoquartz",
                service_id = 112,
                date = "12-02-2024",
            )],
            tickets = [Ticket(
                ticket_name = "Problème de caméra",
                ticket_id = 46478,
                ticket_description = "Ma caméra ne fonctionne plus sur teams.",
                demand_date = "03-03-2025",
                resolution_date = "05-03-2025",
                operator = "Michel Michel",
            )],
            permissions = Permissions(language = "FR",
                                      rh_perms = False,
                                      dsi_perms = True,
                                      siege_perms = True,
                                      mag_perms = False,
                                      supply_perms = False)
        )
