from datetime import datetime
import os
import json

def add_ticket(uid : int,
               ticket_name : str,
               ticket_description : str
               ):
    """Adds the ticket to our mock json that serves here as a list of all incoming demands.
    
    Args : 
        uid : user id
        ticket_name : the name of the ticket
        ticket_description : the description of the ticket

    Returns : 
        A dictionary containing the ticket data:
        {'status': 'success', 'ticket_data': '...'}
    """

    today = datetime.today().strftime('%d-%m-%Y')

    json_path = "../../demands.json"

    ticket_data = {
        "demand_type": "ticket",
        "uid": uid,
        "name": ticket_name,
        "ticket_id": 1, #dummy
        "description": ticket_description,
        "created_at": today
    }

    try:
        os.makedirs(os.path.dirname(json_path), exist_ok=True)

        if os.path.isfile(json_path):
            with open(json_path, "r", encoding="utf-8") as f:
                try:
                    tickets = json.load(f) or []
                except json.JSONDecodeError:
                    # Corrupted or empty file – start fresh
                    tickets = []
        else:
            tickets = []

        tickets.append(ticket_data)
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(tickets, f, ensure_ascii=False, indent=2)

        return {"status": "success", "ticket_data": ticket_data}

    except Exception as e:  # Catch-all to avoid crashing the caller
        return {"status": "error", "message": str(e)}
    

def add_admin_key(uid : int,):
    """Adds the service demand to our mock json that serves here as a list of all incoming demands.
    This is a mockup tool, we should in reality add the logic to do it.
    
    Args : 
        uid : user id
        service_id : the name of the ticket
        ticket_description : the description of the ticket

    Returns : 
        A dictionary containing the ticket data:
        {'status': 'success', 'key': '...'}
    """

    today = datetime.today().strftime('%d-%m-%Y')

    json_path = "../../demands.json"

    ticket_data = {
        "demand_type": "service",
        "uid": uid,
        "name": "Nouvelle clé Admin",
        "service_id": 124, #dummy
        "created_at": today
    }

    try:
        os.makedirs(os.path.dirname(json_path), exist_ok=True)

        if os.path.isfile(json_path):
            with open(json_path, "r", encoding="utf-8") as f:
                try:
                    tickets = json.load(f) or []
                except json.JSONDecodeError:
                    # Corrupted or empty file – start fresh
                    tickets = []
        else:
            tickets = []

        tickets.append(ticket_data)
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(tickets, f, ensure_ascii=False, indent=2)

        return {"status": "success", "ticket_data": ticket_data}

    except Exception as e:  # Catch-all to avoid crashing the caller
        return {"status": "error", "message": str(e)}
    
def horoquartz_access(uid : int,):
    """Adds the service demand to our mock json that serves here as a list of all incoming demands.
    This is a mockup tool, we should in reality add the logic to do it.
    
    Args : 
        uid : user id
        service_id : the name of the ticket
        ticket_description : the description of the ticket

    Returns : 
        A dictionary containing the ticket data:
        {'status': 'success', 'key': '...'}
    """

    today = datetime.today().strftime('%d-%m-%Y')

    json_path = "../../demands.json"

    ticket_data = {
        "demand_type": "service",
        "uid": uid,
        "name": "Nouvelle clé Admin",
        "service_id": 112, #dummy
        "created_at": today
    }

    try:
        os.makedirs(os.path.dirname(json_path), exist_ok=True)

        if os.path.isfile(json_path):
            with open(json_path, "r", encoding="utf-8") as f:
                try:
                    tickets = json.load(f) or []
                except json.JSONDecodeError:
                    # Corrupted or empty file – start fresh
                    tickets = []
        else:
            tickets = []

        tickets.append(ticket_data)
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(tickets, f, ensure_ascii=False, indent=2)

        return {"status": "success", "ticket_data": ticket_data}

    except Exception as e:  # Catch-all to avoid crashing the caller
        return {"status": "error", "message": str(e)}