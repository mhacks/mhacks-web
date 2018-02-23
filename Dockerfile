FROM node:latest

MAINTAINER MHacks Team

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY . /usr/src/app
RUN yarn install
RUN yarn run build
RUN npm install -g nodemon

CMD ["yarn", "start"]

EXPOSE 3000