# Use a standard Node.js base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package configuration files
COPY package.json package-lock.json* ./

# Install dependencies using the same flag that worked for you locally
RUN npm install --legacy-peer-deps

# Copy the rest of your application source code into the container
COPY . .

# Copy the startup script and make it executable
COPY start.sh .
RUN chmod +x ./start.sh

# Build the Next.js application for production
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# The command to start the application using our script
CMD ["./start.sh"] 