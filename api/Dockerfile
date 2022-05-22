FROM node:17-alpine3.14 as production
WORKDIR /api
COPY package*.json .
RUN npm install --silent
ENV NODE_ENV = "production"
COPY . .
CMD ["npm", "run", "start"]
