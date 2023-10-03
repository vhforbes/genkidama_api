# Use official Node.js image as a base image
FROM node:18

# Set the working directory inside the docker image
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the npm packages
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Transpile TypeScript to JavaScript
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/server.js"]