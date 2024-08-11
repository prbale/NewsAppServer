# 1. Specify the base image. Downloaded from dockrhub
FROM node:18

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# 4. Install dependencies which are mentioned in package.json
RUN npm install

# 5. Copy the rest of the application code to the working directory
COPY . .

# 6. Expose the port the app runs on
EXPOSE 3000

# 7. Define the command to run your app
CMD ["node", "server.js"]