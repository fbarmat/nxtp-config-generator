FROM node:18.3.0-alpine
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm i

COPY . ./

ENV PORT 3000

EXPOSE 3000/tcp

CMD ["npm", "start"]
