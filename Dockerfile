
# Use a lightweight Node image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first (helps with caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your server code
COPY . .

# Generate Prisma Client (Required for DB access inside Docker)
RUN npx prisma generate

# Build TypeScript to JavaScript
RUN npm run build

# Open the port your app runs on
EXPOSE 5000

# Start the server
CMD ["node", "dist/index.js"]