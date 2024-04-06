FROM node:20-alpine
# RUN apt-get update
# RUN apt-get install -y openssl libssl-dev

# Set the working directory
WORKDIR /app/
# Copy the package.json and package-lock.json files
COPY package*.json ./

# # Run as a non-privileged user
# RUN adduser --home /app --shell /bin/bash --uid 1001 app
# USER app

# Copy the rest of the application code
COPY . .
# RUN npm cache clean --force

# Install the dependencies
RUN npm install --legacy-peer-deps

# Build the Next.js application
RUN npx prisma generate
#RUN npx prisma db push
RUN npm  run  build

# Expose the default Next.js port
EXPOSE 3001

# Start the Next.js application
CMD [ "npm", "start" ]
