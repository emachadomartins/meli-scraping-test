from audio import solve_audio


def solve_captcha(type, path):
    if type == 'audio':
        return solve_audio(path=path)
    elif type == 'image':
        return solve_image(path=path)
    else:
        raise Exception('Unsupported file_type')
