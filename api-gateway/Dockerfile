FROM node:17-alpine3.14 as dev
WORKDIR /api-gateway
COPY package*.json ./
RUN npm install
ENV NODE_ENV = "development"
COPY ./ ./
CMD ["npm","run", "start-dev"]

FROM node:17-alpine3.14 as production
WORKDIR /api-gateway
COPY package*.json .
RUN npm install --silent
ENV NODE_ENV = "production"
COPY ./ ./
CMD ["npm", "run", "start"]
