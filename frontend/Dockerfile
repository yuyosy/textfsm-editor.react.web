FROM node:lts-buster-slim AS development
 
WORKDIR /app
 
COPY package.json /app
COPY package-lock.json /app

RUN npm ci
 
COPY . /app

EXPOSE 5173
 
CMD [ "npm", "run", "dev" ]
