# AthleteView Platform — Development Commands

.PHONY: help dev test lint docker-up docker-down

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Start all services in development mode
	docker compose -f docker-compose.dev.yml up -d
	@echo "Services starting..."
	@echo "Gateway:    http://localhost:3000"
	@echo "AI Service: http://localhost:8001"
	@echo "Streaming:  http://localhost:8002"
	@echo "Biometrics: http://localhost:8003"

test: ## Run all tests
	cd gateway && npm test
	cd ai-service && pytest tests/ -v
	cd biometrics && pytest tests/ -v

lint: ## Lint all services
	cd gateway && npm run lint
	cd ai-service && ruff check src/
	cd biometrics && ruff check src/

docker-up: ## Start production Docker stack
	docker compose up -d

docker-down: ## Stop all Docker containers
	docker compose down

db-migrate: ## Run database migrations
	@echo "TODO: Add migration tool (Alembic / Prisma)"

kafka-topics: ## Create Kafka topics
	docker exec -it athleteview-kafka kafka-topics --create --topic video.frames.raw --partitions 6 --replication-factor 1 --bootstrap-server localhost:9092
	docker exec -it athleteview-kafka kafka-topics --create --topic video.frames.enhanced --partitions 6 --replication-factor 1 --bootstrap-server localhost:9092
	docker exec -it athleteview-kafka kafka-topics --create --topic biometrics.readings --partitions 3 --replication-factor 1 --bootstrap-server localhost:9092
	docker exec -it athleteview-kafka kafka-topics --create --topic highlights.detected --partitions 3 --replication-factor 1 --bootstrap-server localhost:9092
