.DEFAULT_GOAL := all

.PHONY: default

include .env.local
export $(shell sed 's/=.*//' .env)

run-dev:
	export ODOO_KAFKA_TASK_TOPIC=dev-test\
	&& npm run start:dev
