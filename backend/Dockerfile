# Use Node.js LTS image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Expose the application's port
EXPOSE 5000

# Start the Node.js server
CMD ["npm", "start"]
