FROM node:12

COPY package*.json *.js ./
ADD assets ./assets
RUN npm install

CMD ["node","index.js"]
