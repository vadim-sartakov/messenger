FROM node:12.16.2-alpine3.11
WORKDIR /app
COPY server/package*.json ./
COPY web/package*.json web/.babelrc web/webpack.config.js web-temp/

RUN npm install --production
RUN cd web-temp && npm install

COPY server/lib lib
COPY web/src web-temp/src
COPY web/public web-temp/public

RUN cd web-temp && npm run build
RUN cp -r web-temp/build ./web && rm -rf web-temp/

# Removing npm cache
RUN rm -rf ~/.npm

CMD npm start