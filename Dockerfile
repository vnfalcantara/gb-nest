FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm cache clean --force && rm -rf node_modules
RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000
CMD [ "node", "dist/src/main.js" ]