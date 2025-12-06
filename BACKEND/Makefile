# Makefile for content-service-backend

.PHONY: help up down build test lint fmt seed logs

help:
	@echo "Commands:"
	@echo "  up           : Start all services with Docker Compose."
	@echo "  down         : Stop all services."
	@echo "  build        : Build the TypeScript source code."
	@echo "  test         : Run tests."
	@echo "  lint         : Lint the source code."
	@echo "  fmt          : Format the source code with Prettier."
	@echo "  seed         : Seed the database with sample data."
	@echo "  logs         : Follow logs for the api service."
	@echo "  refresh-cache: Manually trigger the cache refresh job."


up:
	@echo "Starting docker containers..."
	docker-compose up --build -d

down:
	@echo "Stopping docker containers..."
	docker-compose down

build:
	@echo "Building TypeScript..."
	npm run build

test:
	@echo "Running tests..."
	npm run test

lint:
	@echo "Linting code..."
	npm run lint

fmt:
	@echo "Formatting code..."
	npm run fmt

seed:
	@echo "Seeding database..."
	docker-compose exec api npm run seed

logs:
	@echo "Following api logs..."
	docker-compose logs -f api

refresh-cache:
	@echo "Running cache refresh job..."
	docker-compose exec api npm run job:refresh-cache

