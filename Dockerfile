# Build from a node base image
FROM node:21

# Update the image packages
RUN apt-get update

# Set the work directory to user_service
WORKDIR /patient_service

# Copy the package.json first
COPY package*.json /patient_service

# Install dependecies in a separate layer to make use of Docker layer caching
RUN npm install --omit=dev

# copy the rest of the project files
COPY . /patient_service/

ENV MONOGO_URI=''

# App uses port 3000
EXPOSE 3001

# Set entry point for the app
ENTRYPOINT [ "npm", "run", "start" ]