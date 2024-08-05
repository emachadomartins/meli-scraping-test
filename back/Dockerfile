FROM python:3.12

WORKDIR /app

RUN apt-get update \
    && apt-get -y install tesseract-ocr \ 
    && apt-get -y install ffmpeg libsm6 libxext6 

RUN apt-get update && \
    apt-get install --no-install-suggests --no-install-recommends --yes pipx

ENV PATH="/root/.local/bin:${PATH}"

RUN pipx install poetry

RUN pipx inject poetry poetry-plugin-bundle

COPY . /app

RUN poetry install

EXPOSE 5000
CMD [ "poetry", "run", "python", "-m", "flask", "--app", "src/index", "run", "--host=0.0.0.0" ]