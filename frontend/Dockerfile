# Use Node.js LTS image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Expose the Vite development server's port
EXPOSE 5173

# Start the Vite server
CMD ["npm", "run", "dev"]
