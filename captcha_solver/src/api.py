from flask import Flask, request, json

from src.captcha import solve_captcha

app = Flask(__name__)


@app.route('/')
def health_check():
    return {'running': True}, 200


@app.route('/captcha', methods=['PUT'])
def captcha_solver():
    try:
        print(request)
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
            'captcha': solve_captcha(file=file, file_type=file_type, file_name=file_name)
        }, 200
    except Exception as e:
        return {
            'error': str(e)
        }, 500


if __name__ == '__main__':
    app.run()
