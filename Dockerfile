FROM node:14.15.1-alpine

WORKDIR /usr/src/fluiddb
COPY . /usr/src/fluiddb/
RUN npm install

# Default Production Port 6375
EXPOSE 6375

# Set to run using Production settings
ENV NODE_ENV=production

CMD ["npm","start"]