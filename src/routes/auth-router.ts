import Router from 'express';
import authController from '../controllers/auth-controller';
import { validationMiddleware } from '../middlewares/validation-middleware';
import { userAuthSchema } from '../schemas/user-schema';

export const authRouter = Router();

authRouter.post('/registration', validationMiddleware(userAuthSchema), authController.registration);
authRouter.post('/login', authController.login);
authRouter.post('/logout', authController.logout);
authRouter.get('/refresh', authController.refresh);
