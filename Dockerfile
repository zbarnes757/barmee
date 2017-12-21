FROM node:8.9.3-alpine

RUN mkdir src
COPY . /src
RUN rm -rf /src/node_modules
RUN cd /src; npm install

EXPOSE  3000
CMD ["node", "/src/bin/www"]
