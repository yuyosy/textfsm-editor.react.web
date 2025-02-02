# ==========================
# Development stage
# ==========================
FROM node:lts-buster-slim AS development
 
WORKDIR /app
 
# Copy package files for dependency installation
COPY package.json /app
COPY package-lock.json /app

# Install dependencies
RUN npm ci
 
# Copy application code
COPY . /app

# Expose development server port
EXPOSE 5173
 
# Start development server with host binding for container access
CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173" ]

