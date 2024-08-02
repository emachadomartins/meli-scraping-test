import whisper


def solve_audio(path):
    model = whisper.load_model('base')
    result = model.transcribe(path)
    return result['text']
