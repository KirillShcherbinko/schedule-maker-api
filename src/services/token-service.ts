import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from '../prisma';

class TokenService {
  generateToken(payload: JwtPayload) {
    const accessSecret = process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!accessSecret || !refreshSecret) {
      throw new Error('JWT secrets are not defined');
    }

    const accessToken = jwt.sign(payload, accessSecret, { expiresIn: '2m' });
    const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '15h' });

    return { accessToken, refreshToken };
  }

  validateRefreshToken<T extends JwtPayload>(refreshToken: string) {
    try {
      const refreshSecret = process.env.JWT_REFRESH_SECRET;
      if (!refreshSecret) throw new Error('Refresh JWT secret is not defined');

      const decoded = jwt.verify(refreshToken, refreshSecret);
      return typeof decoded === 'object' && decoded !== null ? decoded as T : null;
    } catch (error) {
      return null;
    }
  }

  validateAccessToken<T extends JwtPayload>(accessToken: string) {
    try {
      const accessSecret = process.env.JWT_ACCESS_SECRET;
      if (!accessSecret) throw new Error('Access JWT secret is not defined');

      const decoded = jwt.verify(accessToken, accessSecret);
      return typeof decoded === 'object' && decoded !== null ? decoded as T : null;
    } catch (error) {
      return null;
    }
  }

  async findToken(refreshToken: string) {
    const tokenData = prisma.token.findUnique({ where: { refreshToken } });
    return tokenData;
  }

  async saveToken(userId: number, refreshToken: string) {
    const tokenData = await prisma.token.findUnique({ where: { userId } });

    if (tokenData) {
      return await prisma.token.update({
        where: { userId },
        data: { refreshToken },
      });
    }

    return await prisma.token.create({ data: { userId, refreshToken } });
  }

  async removeToken(refreshToken: string) {
    const tokenData = await prisma.token.delete({ where: { refreshToken } });
    return tokenData;
  }
}

export default new TokenService();
