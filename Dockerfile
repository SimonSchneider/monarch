FROM node:14
WORKDIR /usr/src/app
COPY services/monarch-api/package*.json ./
RUN npm ci --only=production

COPY services/monarch-api/src ./
COPY services/monarch-ui/build ./build

RUN ls

EXPOSE 9081
ENV PROMETHEUS_HOST=http://host.docker.internal:9090
CMD [ "node", "server.js"]
