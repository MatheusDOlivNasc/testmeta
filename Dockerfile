FROM node:24.10-alpine AS builder

WORKDIR /app

RUN npm install

RUN npm run build

EXPOSE 3000

CMD [ "node", "./dist/index.js" ]