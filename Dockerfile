FROM node:argon-slim

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ADD . /usr/src/app/
RUN npm install --production
CMD [ "node", "server.js" ]
