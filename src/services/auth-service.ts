import { hashSync, compareSync } from 'bcrypt';
import prisma from '../prisma';
import tokenService from './token-service';

class AuthService {
  async registration(email: string, password: string) {
    const candidate = await prisma.user.findUnique({
      where: { email },
    });

    if (candidate) throw new Error('This email is already taken');

    const passwordHash = hashSync(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true },
    });

    const tokens = tokenService.generateToken({ ...user });
    await tokenService.saveToken(user.id, tokens.refreshToken);

    return { ...tokens, ...user };
  }
}

export default new AuthService();
