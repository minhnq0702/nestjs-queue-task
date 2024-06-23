FROM node:21.1.0-alpine
ENV NODE_ENV production
# ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /usr/src/

COPY package*.json ./
RUN npm install
# RUN npm ci --only=production


RUN npm install -g pm2
RUN SHELL=/bin/bash pm2 completion install
RUN pm2 update

COPY . .
RUN npm run build
COPY .env.docker ./.env
CMD ["node", "dist/src/main.js"]
EXPOSE 3000
