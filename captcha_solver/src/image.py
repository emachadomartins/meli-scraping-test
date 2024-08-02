from PIL import Image
import pytesseract


def solve_image(path):
    image = Image.open(path)
    text = pytesseract.image_to_string(image)
    return text
