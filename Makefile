.DEFAULT_GOAL := all

.PHONY: default

run-redis:
	docker run -p 6379:6379 --name redis-dev -d redis

build-app:
	docker build -t minhnq0702/nest-queue-job:latest .

run-app:
	docker run -p 3000:3000 --name nest-queue-job --network=dev --network-alias=queue-job minhnq0702/nest-queue-job:latest