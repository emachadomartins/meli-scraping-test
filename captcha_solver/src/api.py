from flask import Flask, request

app = Flask(__name__)


@app.route('/')
def health_check():
    return {'running': True}, 200


@app.route('/captcha', methods=['PUT'])
def captcha_solver():
    try:
        data = request.get_json()

        if data is None:
            raise Exception('No data provided')

        if not 'file_type' in data:
            raise Exception('No file_type provided')

        if not 'file_path' in data:
            raise Exception('No file_path provided')

        file_type = data['file_type']
        file_path = data['file_path']

        return {
            'captcha': data
        }, 200
    except Exception as e:
        return {
            'error': str(e)
        }, 500


if __name__ == '__main__':
    app.run()
