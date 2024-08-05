from flask import Flask, Response, request
from flask_cors import CORS
from src.utils import const, tasks, text

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/')
# @cross_origin()
def health_check():
    return {
        'running': True
    }, 200


@app.route('/text', methods=['PUT'])
def text():
    try:
        if not 'file' in request.files:
            raise Exception('No file provided')

        if not 'file_type' in request.form:
            raise Exception('No file_type provided')

        if not 'file_name' in request.form:
            raise Exception('No file_name provided')

        file_type = request.form['file_type']
        file_name = request.form['file_name']
        file = request.files['file']

        return {
            'result': text.text_converter(
                file=file, file_type=file_type, file_name=file_name)
        }, 200
    except Exception as e:
        return {
            'error': str(e)
        }, 500


@app.route('/task', methods=['POST', 'GET'], defaults={'id': None, 'file_name': None})
@app.route('/task/<id>', methods=['GET'], defaults={'file_name': None})
@app.route('/task/<id>/<file_name>', methods=['GET'])
def task(id, file_name):

    try:
        if request.method == 'GET':
            if id is None:
                return {
                    'tasks': tasks.get_tasks()
                }, 200
            if file_name is None:
                return {
                    'task': tasks.get_single_task()
                }, 200

            extension = file_name.split('.')[1]
            mimetype = const.MIMETYPES[extension]

            if mimetype is None:
                raise Exception('Invalid extension')

            return Response(tasks.get_task_file(id, file_name), mimetype=mimetype), 200
        elif request.method == 'POST':
            data = request.get_json()
            if not 'message' in data:
                raise Exception('No message provided')

            message = data['message']

            if not 'url' in message:
                raise Exception('No url provided')

            url = message['url']
            steps = message['steps']

            return {
                'message': tasks.create_task(url, steps)
            }, 200
    except Exception as e:
        return {
            'error': str(e)
        }, 500


@app.after_request
def creds(response):
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response


if __name__ == '__main__':
    app.run()
