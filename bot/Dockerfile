FROM node as dev
RUN apt-get update -y
RUN apt-get install -y tzdata
WORKDIR /bot
COPY package*.json ./
RUN npm install
COPY ./ ./
ENV TZ Europe/Madrid
CMD ["npm", "run", "start-dev"]

FROM  arm64v8/node:lts-slim as production
RUN apt-get update -y
RUN apt-get install -y tzdata
WORKDIR /bot
COPY package*json ./
RUN npm install
COPY ./ ./
ENV TZ Europe/Madrid
CMD ["npm", "start"]
