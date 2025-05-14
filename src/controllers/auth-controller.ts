import { Request, Response } from 'express';
import authService from '../services/auth-service';

class AuthController {
  async registration(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const userData = await authService.registration(email, password);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 15 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.json({ ...userData });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'Incorrect email or password' });
      }
    }
  }
}

export default new AuthController();
