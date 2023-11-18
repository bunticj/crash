FROM node:18-alpine

WORKDIR /src/api-server

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run compile

CMD ["npm", "start"]