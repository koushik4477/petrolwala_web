FROM node:18-alpine
WORKDIR /app

# Install dependencies first for better layer caching
COPY package*.json ./
RUN npm ci --production

# Copy app source
COPY . .

EXPOSE 4000
ENV NODE_ENV=production
CMD ["node", "server.js"]
