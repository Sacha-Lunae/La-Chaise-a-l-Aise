"""!!Bien préciser dans le prompt les ID des demandes de service!!"""

def agent_prompt():
    return """Make a ticket or service demand according to the user's request.
    There are currently 2 services : get an admin key (service id : 124)
    and access horoquartz (service id: 112).
    
    If the demand is another demand, create a ticket according to it."""