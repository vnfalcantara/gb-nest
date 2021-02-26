import * as Joi from '@hapi/joi';

export const environmentSchema = Joi.object({
	
	NODE_ENV: Joi.string()
		.valid('local', 'debug', 'test', 'development', 'production')
		.default('local'),

	MONGO_URI: Joi.string().required(),
	MONGO_RETRY_ATTEMPTS: Joi.number().required(),
	MONGO_RETRY_DELAY: Joi.number().required(),
	MONGO_CONNECTION_NAME: Joi.string().required(),

	REDIS_HOST: Joi.string().required(),
	REDIS_PORT: Joi.number().required()

})