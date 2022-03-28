FROM node:latest
WORKDIR /app

COPY *.json .
RUN npm install

COPY . .

CMD ["npm", "start"]