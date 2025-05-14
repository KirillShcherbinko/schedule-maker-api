import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { authRouter } from './routes/auth-router';

import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(cookieParser());

app.use("/auth", authRouter);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
