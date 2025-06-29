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
    },

    // Application configuration
    app: {
        port: parseInt(process.env.PORT ?? '5000', 10),
        environment: process.env.NODE_ENV ?? 'development',
    },

    // Google OAuth configuration
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID ?? 'your-google-client-id',
        clientSecret:
            process.env.GOOGLE_CLIENT_SECRET ?? 'your-google-client-secret',
        callbackUrl:
            process.env.GOOGLE_CALLBACK_URL ??
            'http://localhost:3000/api/v1/auth/google/callback',
    },

    // Frontend configuration
    frontend: {
        url: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    },

    // Gemini AI configuration
    gemini: {
        apiKey: process.env.GEMINI_API_KEY ?? 'your-gemini-api-key',
        model: process.env.GEMINI_MODEL ?? 'gemini-1.5-flash',
        maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS ?? '1024', 10),
    },

    // Open AI
    openai: {
        apiKey: process.env.OPENAI_API_KEY ?? '',
        sttModel: process.env.OPENAI_SPEECH_TO_TEXT_MODEL ?? 'gpt-3.5-turbo',
    },

    // MongoDB configuration
    mongodb: {
        uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/nestjs_db',
        database: process.env.MONGODB_DB_NAME ?? 'nestjs_db',
    },
});