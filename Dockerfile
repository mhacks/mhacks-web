FROM node:8

MAINTAINER MHacks Team

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY package.json /usr/src/app/
COPY yarn.lock /usr/src/app/
RUN yarn install
RUN npm install -g nodemon
COPY . /usr/src/app

CMD ["yarn", "run", "startprod"]

EXPOSE 3000