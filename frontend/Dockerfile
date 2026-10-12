FROM node:24 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

# Vite incrusta la variable en el build; por defecto se usa la ruta relativa que sirve nginx
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:1.29-alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
