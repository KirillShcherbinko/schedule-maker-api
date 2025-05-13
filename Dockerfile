FROM node:slim

COPY package.json package-lock.json ./
COPY prisma ./prisma/


RUN npm i

COPY . .

CMD ["sh", "-c", "sleep 10 && npm run db:deploy && npm run dev"] 