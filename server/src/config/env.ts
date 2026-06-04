import { z } from 'zod';

const schema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 chars'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    CORS_ORIGIN: z
        .string()
        .default('http://localhost:5173')
        .transform((s) =>
            s
                .split(',')
                .map((o) => o.trim())
                .filter(Boolean),
        ),
    LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
    // Storage backend: 'local' writes to disk + serves via /static (dev/testing); 's3' uses AWS/S3.
    STORAGE_DRIVER: z.enum(['local', 's3']).default('s3'),
    LOCAL_UPLOAD_DIR: z.string().optional(),
    // Base URL the server is reachable at, used to build local file URLs (defaults to http://localhost:<PORT>).
    PUBLIC_BASE_URL: z.string().url().optional(),
    S3_REGION: z.string().min(1).optional(),
    S3_BUCKET: z.string().min(1).optional(),
    S3_ACCESS_KEY_ID: z.string().min(1).optional(),
    S3_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    S3_ENDPOINT: z.string().url().optional(),
    S3_FORCE_PATH_STYLE: z
        .string()
        .optional()
        .transform((v) => v === 'true' || v === '1'),
    S3_PUBLIC_URL: z.string().url().optional(),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().int().positive().optional(),
    SMTP_SECURE: z
        .string()
        .optional()
        .transform((v) => v === 'true' || v === '1'),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_FROM: z.string().optional(),
}).superRefine((val, ctx) => {
    if (val.STORAGE_DRIVER === 's3') {
        for (const key of [
            'S3_REGION',
            'S3_BUCKET',
            'S3_ACCESS_KEY_ID',
            'S3_SECRET_ACCESS_KEY',
        ] as const) {
            if (!val[key]) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: [key],
                    message: `${key} is required when STORAGE_DRIVER=s3`,
                });
            }
        }
    }
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    console.error('Invalid environment variables:', fieldErrors);
    if (process.env.VERCEL === '1') {
        throw new Error(`Invalid env: ${JSON.stringify(fieldErrors)}`);
    }
    process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
