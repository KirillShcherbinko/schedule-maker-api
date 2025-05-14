import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from '../prisma';

class TokenService  {
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
}

export default new TokenService ();
