FROM node:20-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=dev

COPY . .

RUN npm run build otp-service

FROM node:20-alpine as run

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=build /usr/src/app/dist ./dist

CMD ["node","dist/apps/otp-service/main.js"]