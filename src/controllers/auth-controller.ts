import { Request, Response } from 'express';
import authService from '../services/auth-service';
import { cookieOptions } from '../constants';

class AuthController {
  async registration(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const userData = await authService.registration(email, password);

      res.cookie('refreshToken', userData.refreshToken, cookieOptions);

      res.json({ ...userData });
    } catch (error) {
      error instanceof Error
        ? res.status(400).json({ message: error.message })
        : res.status(400).json({ message: 'Incorrect email or password' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const userData = await authService.login(email, password);

      res.cookie('refreshToken', userData.refreshToken, cookieOptions);

      res.json(userData);
    } catch (error) {
      error instanceof Error
        ? res.status(400).json({ message: error.message })
        : res.status(400).json({ message: 'Incorrect email or password' });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;
      const token = await authService.logout(refreshToken);

      res.clearCookie('refreshToken');

      res.json({ token, message: 'Logged out successfully' });
    } catch (error) {
      error instanceof Error
        ? res.status(400).json({ message: error.message })
        : res.status(400).json({ message: 'Couldn`t log out' });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await authService.refresh(refreshToken);

      res.cookie('refreshToken', userData.refreshToken, cookieOptions);

      res.json(userData);
    } catch(error) {
      error instanceof Error
        ? res.status(401).json({ message: error.message })
        : res.status(401).json({ message: 'Unauthorized' });
      }
  }
}

export default new AuthController();
