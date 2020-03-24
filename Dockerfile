FROM node:9-slim
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .

EXPOSE 8080
CMD [ "npm", "run", "start.dev" ]