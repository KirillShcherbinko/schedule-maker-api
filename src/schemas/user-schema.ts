import { z } from 'zod';

export const userAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(32),
});
