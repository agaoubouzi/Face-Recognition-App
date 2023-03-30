# Use an official Node.js runtime as a parent image
FROM node:lts-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json to the working directory
COPY package.json ./

RUN apk add --no-cache --virtual .build-deps \
        build-base \
	g++ \
	cairo-dev \
	jpeg-dev \
	pango-dev \
	giflib-dev \
    && apk add --no-cache --virtual .runtime-deps \
        cairo \
	jpeg \
	pango \
	giflib 

RUN npm install

# Copy the rest of the app's code to the working directory
COPY . .



# Build the app using Vite
RUN npm run build

# Expose the container's port
EXPOSE 8000

# Start the app
CMD ["npm", "run", "dev"]