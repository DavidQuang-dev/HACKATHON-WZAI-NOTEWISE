export default () => ({
    // Database configuration
    db: {
        host: process.env.DB_HOST ?? 'localhost',
        port: parseInt(process.env.DB_PORT ?? '5432', 10),
        username: process.env.DB_USERNAME ?? 'postgres',
        password: process.env.DB_PASSWORD ?? '',
        name: process.env.DB_DATABASE ?? 'nestjs_db',
        logging: process.env.DB_LOGGING === 'true',
    },

    // JWT configuration
    jwt: {
        secret: process.env.JWT_SECRET ?? 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRATION ?? '15m',
        refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'your-refresh-secret-key',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION ?? '7d',
    },

    // Application configuration
    app: {
        port: parseInt(process.env.PORT ?? '5000', 10),
        environment: process.env.NODE_ENV ?? 'development',
    },
});