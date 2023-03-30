# Use an official Node.js runtime as a parent image
FROM node:lts-alpine

# Set the working directory to /app
WORKDIR /app

# Copy package.json to the working directory
COPY package.json ./


# Copy the rest of the app's code to the working directory
COPY . .

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

# Expose the container's port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]