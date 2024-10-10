FROM node:18-alpine

WORKDIR /dashboard

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

COPY static/ /dashboard/dist/static/

CMD ["npm", "run", "preview", "--", "--port", "8085", "--host"]
