import redis
import os
import json

# Cria o cliente do redis a partir das variaveis de ambiente
client = redis.Redis(host=os.getenv('REDIS_HOST'),
                     port=6379 if os.getenv('REDIS_PORT') is None else int(str(os.getenv('REDIS_PORT'))))


# Função que salva uma informação no cache do Redis
def set_cache(info, keys: list[str]):
    try:
        print(':'.join(keys))
        client.set(':'.join(keys), json.dumps(info))
        return True
    except Exception as e:
        print(e)
        return False


# Função que busca uma informação no cache do Redis
def get_cache(keys: list[str]):
    info = client.get(':'.join(keys))
    if not info:
        return None

    return json.loads(info)
