FROM node:24

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3001

# tsx watch recarga al cambiar archivos; la config .env.local se monta con el volumen
CMD ["npx", "tsx", "watch", "--env-file=.env.local", "src/index.ts"]
