// APP CONFIG CONSTANT
export const APP_PORT = 'APP_PORT';

// KAFKA CONFIG CONSTANT
export const KAFKA_BROKERS = 'KAFKA_BROKERS';
export const KAFKA_SSL = 'KAFKA_SSL';
export const KAFKA_SASL_MECHANISM = 'KAFKA_SASL_MECHANISM';
export const KAFKA_USERNAME = 'KAFKA_USERNAME';
export const KAFKA_PASSWORD = 'KAFKA_PASSWORD';

// DB CONFIG CONSTANT
export const DB_CONFIG = {
  DB_URI: 'DB_URI',
  DB_NAME: 'DB_NAME',
  DB_USER: 'DB_USER',
  DB_PASSWORD: 'DB_PASSWORD',
};

// ODOO CONFIG CONSTANT
export const ODOO_CONFIG = {
  // ODOO_QUEUE_TASK_CHANNEL: 'ODOO_QUEUE_TASK_CHANNEL',
  ODOO_QUEUE_TASK_CHANNEL: process.env.ODOO_QUEUE_TASK_CHANNEL,

  // ODOO_CONCURRENCY: 'ODOO_CONCURRENCY',
  ODOO_CONCURRENCY: parseInt(process.env.ODOO_CONCURRENCY),

  ODOO_URL: 'ODOO_URL',
  ODOO_DB: 'ODOO_DB',
  ODOO_HTTP_USER: 'ODOO_HTTP_USER',
  ODOO_HTTP_PASSWORD: 'ODOO_HTTP_PASSWORD',
};

export const JWT_SECRET = 'JWT_SECRET';

export const EMIT_CREATE_TASK = 'task.do.create';
