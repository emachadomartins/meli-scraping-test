import os
from uuid import uuid4 as uuid

import pytesseract
import whisper
from pdf2image import convert_from_path
from PIL import Image


def solve_pdf(path):
    pages = convert_from_path(path, 500)
    return [pytesseract.image_to_string(page) for page in pages]


def solve_audio(path):
    model = whisper.load_model('base')
    result = model.transcribe(path)

    return ''.join(result['text'].replace(' ', '').split(','))


def solve_image(path):
    image = Image.open(path)
    text = pytesseract.image_to_string(image)
    return text


def text_converter(file, file_type: str, file_name: str):
    id = uuid()
    extension = file_name.split('.')[1]
    path = os.path.join('input', f'{file_type}-{id}.{extension}')
    file.save(path)

    if file_type == 'audio':
        resolution = solve_audio(path=path)
    elif file_type == 'image':
        resolution = solve_image(path=path)
    elif file_type == 'pdf':
        resolution = solve_image(path=path)
    else:
        raise Exception('Unsupported file_type')

    os.remove(path)

    return resolution
