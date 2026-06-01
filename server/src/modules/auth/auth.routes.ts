import { Router } from 'express';
import { validate } from '@/middleware/validate.js';
import { requireAuth } from '@/middleware/auth.js';
import { issueCsrfToken, requireCsrf } from '@/middleware/csrf.js';
import { changePasswordSchema, loginSchema, registerSchema } from './auth.schema.js';
import {
    changePasswordHandler,
    csrfHandler,
    loginHandler,
    logoutHandler,
    meHandler,
    registerHandler,
} from './auth.controller.js';

export const authRouter: Router = Router();

authRouter.get('/csrf', issueCsrfToken, csrfHandler);
authRouter.post('/register', validate(registerSchema), registerHandler);
authRouter.post('/login', validate(loginSchema), loginHandler);
authRouter.post('/logout', logoutHandler);
authRouter.get('/me', requireAuth, meHandler);
authRouter.post(
    '/change-password',
    requireAuth,
    requireCsrf,
    validate(changePasswordSchema),
    changePasswordHandler,
);
