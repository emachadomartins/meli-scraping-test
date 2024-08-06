FROM node:20.14

WORKDIR /app

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN apt-get update && apt-get install curl gnupg -y \
    && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install google-chrome-stable -y --no-install-recommends \
    && apt-get install -y xvfb  \
    && apt-get -y install xorg xvfb gtk2-engines-pixbuf \
    && apt-get -y install dbus-x11 xfonts-base xfonts-100dpi xfonts-75dpi xfonts-cyrillic xfonts-scalable \
    && rm -rf /var/lib/apt/lists/*


ENV PATH="/root/.local/bin:${PATH}"

COPY . .

RUN Xvfb -ac :99 -screen 0 1280x1024x16 &
ENV DISPLAY :99

RUN npm install

RUN npm run build

RUN npx puppeteer browsers install chrome

CMD [ "node", "dist/src/run.js" ]