FROM node:lts-buster-slim AS development
 
WORKDIR /usr/app
 
COPY package.json /usr/app
COPY package-lock.json /usr/app

RUN npm ci
 
COPY . /usr/app

EXPOSE 5173
 
CMD [ "npm", "run", "dev" ]
