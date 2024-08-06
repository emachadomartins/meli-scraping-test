from flask import Flask, Response, request
from flask_cors import CORS
from src.utils import const, tasks, text

# Esse arquivo inicia a aplicação Back-End do data-collector
# A aplicação é uma API REST que utiliza a tecnologia Flask

# Inicia a aplicação
app = Flask(__name__)

# Adiciona o CORS para controle de requisições
CORS(app, resources={r"/*": {"origins": "*"}})


# Cria a rota healt_check '/' apenas para verificar se o servidor está rodando
@app.route('/')
def health_check():
    return {
        'running': True
    }, 200


# Cria a rota '/text' que faz a conversão de arquivos para texto [imagens, audios e pdf]
# Metodo aceito [PUT]
@app.route('/text', methods=['PUT'])
def text_converter():
    try:
        # Valida se existe arquivo na requisição e caso não, estoura erro
        if not 'file' in request.files:
            raise Exception('No file provided')

        # Valida se existe o tipo de arquivo na requisição e caso não, estoura erro
        if not 'file_type' in request.form:
            raise Exception('No file_type provided')

        # Valida se existe o nome do arquivo na requisição e caso não, estoura erro
        if not 'file_name' in request.form:
            raise Exception('No file_name provided')

        file_type = request.form['file_type']
        file_name = request.form['file_name']
        file = request.files['file']

        # Executa a conversão pra texto e retorna na api
        return {
            'result': text.text_converter(
                file=file, file_type=file_type, file_name=file_name)
        }, 200
    except Exception as e:
        # Recebe o erro se ocorrer e retorna na api
        return {
            'error': str(e)
        }, 500


# Cria a rota '/task' onde serão feitas todas as operações de tasks
# Metodos aceitos [GET, POST]
# Possui como sub-rotas os valores customizados de id da task e nome do arquivo
@app.route('/task', methods=['POST', 'GET'], defaults={'id': None, 'file_name': None})
@app.route('/task/<id>', methods=['GET'], defaults={'file_name': None})
@app.route('/task/<id>/<file_name>', methods=['GET'])
def task(id, file_name):
    try:
        if request.method == 'GET':
            if id is None:
                # Retorna todas as tasks caso o metodo seja GET e não seja passado nenhum id de task
                return {
                    'tasks': tasks.get_tasks()
                }, 200
            if file_name is None:
                # Retorna uma task especifica caso seja passado um id
                return {
                    'task': tasks.get_single_task()
                }, 200

            extension = file_name.split('.')[1]
            mimetype = const.MIMETYPES[extension]

            # Valida se é um tipo de arquivo esperado e estoura erro caso não
            if mimetype is None:
                raise Exception('Invalid extension')

            # Retorna o arquivo especificado na rota caso seja passado um file_name
            return Response(tasks.get_task_file(id, file_name), mimetype=mimetype), 200
        elif request.method == 'POST':
            # Pega o valor do body caso o metodo seja [POST]
            data = request.get_json()

            # Verifica se existe uma mensagem na request e caso não, estoura erro
            if not 'message' in data:
                raise Exception('No message provided')

            message = data['message']

            # Verifica se existe uma url na mensagem e caso não, estoura erro
            if not 'url' in message:
                raise Exception('No url provided')

            url = message['url']
            steps = message['steps']

            # Envia a task para reprocessamento e retorna a resposta na API
            return {
                'message': tasks.create_task(url, steps)
            }, 200
    except Exception as e:
        # Recebe o erro se ocorrer e retorna na api
        return {
            'error': str(e)
        }, 500


# Adiciona o controle para todas as rotas para aceitar requests externas
@app.after_request
def creds(response):
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response


if __name__ == '__main__':
    app.run()
