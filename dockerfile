FROM node:23-alpine3.20

WORKDIR /usr/app
RUN mkdir src
COPY package*.json .
COPY src/ ./src
COPY vite.config.js .
COPY index.html .

RUN npm install

EXPOSE 5173

CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173" ]
