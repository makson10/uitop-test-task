FROM ubuntu:latest AS development

WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y \
    python3 \
    make \
    g++ \
    sqlite3 \
    libsqlite3-dev \
    curl \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


FROM node:alpine AS production

ARG NODE_ENV=development

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD [ "node", "dist/src/main" ]
