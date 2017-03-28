FROM node

MAINTAINER MHacks Team

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY package.json /usr/src/app/
RUN yarn install
COPY . /usr/src/app

CMD ["yarn", "start"]

EXPOSE 3000