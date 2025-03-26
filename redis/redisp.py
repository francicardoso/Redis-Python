import redis
import time


client = redis.StrictRedis(host='localhost', port=6379, db=0)


def verifier_connexion(email):
    key = f"connexions:{email}"
    connexions = client.get(key)
    if not connexions:
        client.setex(key, 600, 1)  # expire après 10 minutes
        return True
    
    if int(connexions) < 10:
        client.incr(key)  
        return True
    else:
        return False  # L'utilisateur a dépassé la limite de connexions


email = "franci@example.com"  

if verifier_connexion(email):
    print("Connexion autorisée")
else:
    print("Limite de connexions atteinte. Essayez dans 10 minutes.")
