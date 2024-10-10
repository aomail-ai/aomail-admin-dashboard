FROM node:18-alpine

WORKDIR /dashboard

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_BACKEND_SUBDOMAIN_ENV
ENV VITE_BACKEND_SUBDOMAIN_ENV=${VITE_BACKEND_SUBDOMAIN_ENV}

RUN npm run build

COPY static/ /dashboard/dist/static/

CMD ["npm", "run", "preview", "--", "--port", "8085", "--host"]
