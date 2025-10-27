FROM node:18-alpine

# Use /usr/src/app as working directory
WORKDIR /usr/src/app

# Install dependencies (use package-lock if present)
COPY package*.json ./
RUN npm ci --omit=dev || npm install --production

# Copy source
COPY . .

# Expose port used by server
EXPOSE 5000

# Default command
CMD ["node", "server.js"]
