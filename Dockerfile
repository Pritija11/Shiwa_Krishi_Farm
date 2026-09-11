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

RUN addgroup -S nodejs \
    && adduser -S nextjs -G nodejs \
    && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["npm", "start"]
