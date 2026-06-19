FROM node:20-alpine AS builder

ARG REACT_API_URL

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ENV VITE_API_URL=$REACT_API_URL
RUN npm run build -- --mode production

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]