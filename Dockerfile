FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install --only=production

COPY . .

CMD [ "npm", "start" ]
