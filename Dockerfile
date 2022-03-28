FROM node:16-alpine3.14

WORKDIR /app

COPY *.json .
RUN npm install

COPY . .

CMD ["npm", "start"]