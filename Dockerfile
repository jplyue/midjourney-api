FROM node:18

# Create app directory
WORKDIR /Users/esmeralda/Documents/code/wave/midjourney-api

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN yarn install

# If you are building your code for production
# RUN yarn ci --omit=dev

# Bundle app source
COPY . .

# Your app binds to port 8080 so you'll use the EXPOSE instruction to have it mapped by the docker daemon:
EXPOSE 3000

# start server
CMD [ "npx","tsx","server.ts" ]

