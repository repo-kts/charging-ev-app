import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { env } from '@/config/env.js';
import { logger } from '@/lib/logger.js';
import { LOCAL_UPLOAD_DIR } from '@/lib/storage.js';
import { apiRouter } from '@/routes/index.js';
import { errorHandler, notFoundHandler } from '@/middleware/error.js';

export function createApp() {
    const app = express();

    app.disable('x-powered-by');
    app.set('trust proxy', 1);
    app.use(
        helmet({
            crossOriginResourcePolicy: { policy: 'cross-origin' },
        }),
    );
    app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(pinoHttp({ logger }));

    app.get('/health', (_req, res) => {
        res.json({ status: 'ok', uptime: process.uptime() });
    });

    // Local storage driver: serve uploaded files from disk (dev/testing).
    if (env.STORAGE_DRIVER === 'local') {
        app.use(
            '/static',
            express.static(LOCAL_UPLOAD_DIR, { maxAge: '1y', immutable: true, fallthrough: false }),
        );
    }

    app.use('/api', apiRouter);

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}
