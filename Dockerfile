FROM node:18

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package.json and lockfile
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy the rest of the backend code
COPY . .

# Expose port
EXPOSE 8000

CMD ["pnpm", "start"]