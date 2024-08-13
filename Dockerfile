FROM node:20.12.2

WORKDIR /app

COPY package*.json ./

##RUN npm install
RUN npm ci

COPY . ./

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
