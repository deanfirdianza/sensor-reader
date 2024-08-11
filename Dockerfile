FROM node:20-alpine3.19

# Create and change to the app directory
WORKDIR /usr/src/app

# Install dependencies
# First, copy only the package.json and package-lock.json files to take advantage of Docker's caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

RUN ["chmod", "+x", "/node_modules/.bin/ts-node"]

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "run", "dev"]