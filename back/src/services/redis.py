import redis
import os
import json


client = redis.Redis(host=os.getenv('REDIS_HOST'),
                     port=6379 if os.getenv('REDIS_PORT') is None else int(str(os.getenv('REDIS_PORT'))))


def set_cache(info, keys: list[str]):
    try:
        print(':'.join(keys))
        client.set(':'.join(keys), json.dumps(info))
        return True
    except Exception as e:
        print(e)
        return False


def get_cache(keys: list[str]):
    info = client.get(':'.join(keys))
    if not info:
        return None

    return json.loads(info)
