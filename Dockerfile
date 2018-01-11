FROM node:carbon

WORKDIR /usr/src/app
COPY package*.json ./
COPY build/* ./
COPY migrations ./
COPY bin ./

RUN npm install --only=production

CMD [ "node", "./bin/www" ]

