FROM node:16 as builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json package.json

RUN pnpm i

COPY . .

RUN pnpm build

FROM nginx:alpine as runnder

COPY --from=builder /app/dist /usr/share/nginx/html
