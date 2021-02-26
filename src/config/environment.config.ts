export default () => ({
	port: process.env.PORT,
	apitoken: process.env.APITOKEN,
	apitokenIgnore: process.env.APITOKEN_IGNORE === 'true',
	secret: process.env.APP_SECRET,

	database: {
		uri: process.env.MONGO_URI,
		retryAttempts: Number(process.env.MONGO_RETRY_ATTEMPTS),
		retryDelay: Number(process.env.MONGO_RETRY_DELAY),
		connectionName: process.env.MONGO_CONNECTION_NAME
	},

	redis: {
		host: process.env.REDIS_HOST,
		password: process.env.REDIS_PASSWORD,
		port: Number(process.env.REDIS_PORT)
	},

	boticario: {
		host: process.env.BOTICARIO_HOST,
		token: process.env.BOTICARIO_TOKEN
	}
})
