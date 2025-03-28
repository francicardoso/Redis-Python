import redis
import time

client = redis.StrictRedis(host='localhost', port=6379, db=0)

def verifier_connexion(email):
    key = f"connexions:{email}"

    # Supprimer les anciennes tentatives de plus de 10 minutes
    client.zremrangebyscore(key, '-inf', time.time() - 600)
    print(f"Entrées anciennes supprimées pour {email}")

    # Vérifier combien de connexions l'utilisateur a effectuées
    connexions = client.zcard(key)
    print(f"Nombre de connexions pour {email} dans les 10 dernières minutes: {connexions}")

    
    if connexions < 10:
        client.zadd(key, {time.time(): time.time()})
        print(f"Nouvelle connexion ajoutée pour {email} à {time.time()}")
        return True
    else:
        print(f"Limite de connexions atteint pour {email}. Essayez après 10 minutes.")
        return False

# Tester avec un email spécifique
email = "franci@example.com"  

if verifier_connexion(email):
    print("Connexion autorisée")
else:
    print("Limite de connexions atteinte. Essayez dans 10 minutes.")
