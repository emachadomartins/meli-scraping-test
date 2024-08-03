import os
from uuid import uuid4 as uuid

import pytesseract
from pdf2image import convert_from_path


def convert_pdf(file, language):
    id = uuid()
    path = os.path.join('input', f'file-{id}.pdf')
    file.save(path)

    pages = convert_from_path(path, 500)

    return [pytesseract.image_to_string(page, lang=language) for page in pages]
