FROM node:18-alpine


# Copy the package.json and package-lock.json first to leverage Docker cache
WORKDIR /frontend/
COPY frontend /frontend
RUN pwd
RUN ls
RUN npm install --force


# Expose port 80 for Nginx
EXPOSE 3000

# Start Nginx to serve the React app
CMD ["npm", "start"]
