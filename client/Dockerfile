FROM node:16-alpine AS builder

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install

COPY . .

RUN npm run build

# EXPOSE 3000

# CMD ["npm","start"]

FROM nginx:1.21.0-alpine
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


