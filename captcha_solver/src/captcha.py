import os
from uuid import uuid4 as uuid

from src.audio import solve_audio
from src.image import solve_image


def solve_captcha(file, file_type: str, file_name: str):
    id = uuid()
    extension = file_name.split('.')[1]
    path = os.path.join('input', f'{file_type}-{id}.{extension}')
    file.save(path)

    if file_type == 'audio':
        resolution = solve_audio(path=path)
    elif file_type == 'image':
        resolution = solve_image(path=path)
    else:
        raise Exception('Unsupported file_type')

    os.remove(path)

    return resolution
