# EsfirrariaApp

App de cardápio/pedidos construído com Next.js (App Router), Prisma + PostgreSQL, NextAuth (Google e e-mail/senha) e Redux Toolkit.

## Rodando localmente

1. Suba o banco de dados:

```bash
docker compose up -d
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente (veja `.env.example` se existir, ou copie as chaves usadas em `lib/auth.ts` e `lib/prisma.ts`):

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

4. Aplique as migrations do Prisma:

```bash
npx prisma migrate dev
```

5. Rode o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Stack

- [Next.js](https://nextjs.org) (App Router)
- [Prisma](https://www.prisma.io) + PostgreSQL
- [NextAuth](https://next-auth.js.org) (Google OAuth + Credentials)
- [Redux Toolkit](https://redux-toolkit.js.org)
- [Tailwind CSS](https://tailwindcss.com)
