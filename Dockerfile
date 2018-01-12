FROM node:carbon

WORKDIR /usr/src/app
COPY package*.json ./
COPY /build/ ./
RUN mkdir migrations
COPY /migrations/* ./migrations
COPY /bin/* .

RUN npm install --only=production

CMD [ "node", "./www" ]

