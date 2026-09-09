FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl \
    && mkdir -p /etc/ssl/rds \
    && curl -fsSL https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem \
       -o /etc/ssl/rds/global-bundle.pem

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
