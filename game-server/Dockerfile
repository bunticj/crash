FROM node:18-alpine

WORKDIR /src/game-server

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run compile

CMD ["npm", "start"]