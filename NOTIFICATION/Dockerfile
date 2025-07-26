# ===========================
#   Base Image with Bun
# ===========================
FROM oven/bun:1.1.13 AS base

# Set the working directory inside the container
WORKDIR /app

# Copy all project files into the container
COPY . .

# Install dependencies using Bun with a frozen lockfile
RUN bun install --frozen-lockfile

# Optionally run type checking and linting
RUN bun run validate:fix

# ===========================
#   Production Image
# ===========================
FROM oven/bun:1.1.13 AS prod

# Set the working directory inside the container
WORKDIR /app

# Copy the application and dependencies from the base image
COPY --from=base /app /app
# Uncomment the following line if you need to copy environment variables
# COPY .env .env

# Expose the application's port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"]

# ===========================
#   Useful Docker Commands
# ===========================
# Build the Docker image:
#   docker build -t yup .

# Run the Docker container:
#   docker run -p 3000:3000 --env-file .env yup

# Stop all running containers:
#   docker stop $(docker ps -q)

# Remove all stopped containers:
#   docker rm $(docker ps -a -q)