import json
import os
from uuid import uuid4 as uuid

from src.services.aws import put_object, send_message, get_object
from src.services.redis import set_cache, get_cache

tasks_path = 'data-collector/tasks.json'


# Função que pega o arquivo de ultimas 5 tasks no serviço 'AWS-S3', Remove a mais antiga e adiciona a task mais nova
def update_task_file(task):
    tasks = [task]
    raw_tasks = get_object(tasks_path)
    tasks = json.loads(raw_tasks) if raw_tasks is not None else tasks
    tasks = [t for t in tasks if t['id'] != task['id']]
    tasks.append(task)
    put_object(json.dumps(tasks), tasks_path)
    return tasks


# Função que pega o arquivo das ultimas 5 tasks e retorna essa informação
def get_tasks():
    raw_tasks = get_object(tasks_path)
    tasks = json.loads(raw_tasks) if raw_tasks is not None else []

    if (len(tasks) == 0):
        return []

    return [get_cache(['task', task['id']]) for task in tasks]


# Função que recebe uma url e uma lista de instruções, cria uma task e envia para o 'AWS-SQS' para executar
def create_task(url: str, steps: list):
    steps = [] if steps is None else steps

    task = {
        'id': str(uuid()),
        'url': url,
        'steps': steps
    }

    # Envia mensagem para o SQS
    send_message(task)

    # Adiciona a task no cache do Redis para outras rotas utilizarem de sua informação
    set_cache({
        'id': task['id'],
        'url': url,
        'complete': False
    },
        ['task', task['id']]
    )

    # Adiciona a task mais recente junto com as ultimas 4 solicitadas
    update_task_file(task)

    return task


# Função que procura e retorna uma task no Redis a partir do seu ID
def get_single_task(id: str):
    task = get_cache(['task', id])

    task['files'] = [
        '/'.join([os.getenv('API_URL'), 'task', file]) for file in task['files']]

    return task


# Função que retorna o conteudo de um arquivo de coleta armazenado no S3 a partir de seu nome e id da task
def get_task_file(id: str, file_name: str):
    result = get_object(
        '/'.join(['data-collector', 'output', id, file_name]))
    if result is None:
        raise Exception('File not found')
    return result
