FROM node:20.14

WORKDIR /app
COPY . . 
RUN npm install
RUN npm run build
RUN cd client && npm install && npm run build

FROM node:20.14

WORKDIR /app
COPY . .
RUN npm install --only=production

EXPOSE 3000
CMD npm start