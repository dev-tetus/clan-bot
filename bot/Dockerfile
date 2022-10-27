FROM node:latest as dev
RUN apt-get update -y
RUN apt-get install -y tzdata
WORKDIR /bot
COPY package*.json ./
RUN npm install
COPY ./ ./
ENV TZ Europe/Madrid
CMD ["npm", "run", "start-dev"]

FROM node:latest as production
RUN apt-get update -y
RUN apt-get install -y tzdata
WORKDIR /bot
COPY package*json ./
RUN npm install
COPY ./ ./
ENV TZ Europe/Madrid
CMD ["npm", "start"]
