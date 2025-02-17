FROM node:14-alpine as build
WORKDIR /app
COPY ../frontend/ . RUN npm install
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
