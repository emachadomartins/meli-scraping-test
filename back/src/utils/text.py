import os
from uuid import uuid4 as uuid

import pytesseract
import whisper
from pdf2image import convert_from_path
from PIL import Image


# Função executada que converte pdf em texto utilizando as libs 'pdf2image' e 'pytesseract'
def solve_pdf(path):
    pages = convert_from_path(path, 500)
    return ''.join([pytesseract.image_to_string(page) for page in pages])


# Função executada que converte audio em texto utilizando a lib 'whisper'
def solve_audio(path):
    model = whisper.load_model('base')
    result = model.transcribe(path)

    return ''.join(result['text'].replace(' ', '').replace('.', '').split(','))


# Função executada que converte imagem em texto utilizando a lib 'pytesseract'
def solve_image(path):
    image = Image.open(path)
    text = pytesseract.image_to_string(image)
    return text


# Função que recebe o arquivo e verifica qual conversão será feita
def text_converter(file, file_type: str, file_name: str):
    # Salva o arquivo recebido na memoria (Pasta 'input')
    id = uuid()
    extension = file_name.split('.')[1]
    path = os.path.join('input', f'{file_type}-{id}.{extension}')
    file.save(path)

    # Verifica qual conversão por file_type e estoura erro caso não seja um valor aceito
    if file_type == 'audio':
        resolution = solve_audio(path=path)
    elif file_type == 'image':
        resolution = solve_image(path=path)
    elif file_type == 'pdf':
        resolution = solve_pdf(path=path)
    else:
        raise Exception('Unsupported file_type')

    # Deleta o arquivo da memoria após executado
    os.remove(path)

    return resolution
