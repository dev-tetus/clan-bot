FROM node:latest

RUN apt-get update -y
RUN apt-get install -y tzdata


WORKDIR /app

COPY *.json ./
RUN npm install

COPY . ./

ENV TZ Europe/Madrid

CMD ["npm", "start"]