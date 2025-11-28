.PHONY: build up down logs dev install help

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

dev:
	npm run start:dev

install:
	npm install

help:
	@echo "Available commands:"
	@echo "  make build    - Build docker containers"
	@echo "  make up       - Start docker containers in detached mode"
	@echo "  make down     - Stop and remove docker containers"
	@echo "  make logs     - View logs of docker containers"
	@echo "  make dev      - Run the NestJS application in development mode"
	@echo "  make install  - Install npm dependencies"
