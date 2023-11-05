FROM node:alpine

WORKDIR /app
COPY package.json ./
RUN yarn install

COPY . .
RUN yarn build

CMD ["node", "build/index.js"]

EXPOSE 3000
