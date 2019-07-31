FROM node:latest

LABEL maintainer="MHacks Team <tech@mhacks.org>" 

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
WORKDIR /usr/src/app

RUN npm install -g nodemon

ADD yarn.lock .
ADD package.json .

RUN yarn install

ADD . .

RUN yarn run build

CMD ["yarn", "start"]
EXPOSE 3000
