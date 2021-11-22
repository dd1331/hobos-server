# syntax=docker/dockerfile:1

FROM node:14.9.0
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production
RUN npm run build

COPY . .
