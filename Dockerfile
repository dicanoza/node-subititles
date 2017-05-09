FROM node:7-alpine

RUN mkdir -p /usr/src/app

VOLUME /usr/folder

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm cache clean 

CMD ["npm","start"] 