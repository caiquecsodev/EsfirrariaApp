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
MERCADOPAGO_ACCESS_TOKEN=
MERCADOPAGO_WEBHOOK_SECRET=
```

Para o `MERCADOPAGO_ACCESS_TOKEN` (modo sandbox, sem custo):

1. Crie uma conta em [mercadopago.com.br/developers](https://www.mercadopago.com.br/developers).
2. Vá em **Suas integrações** → crie uma aplicação.
3. Na aba **Credenciais de teste**, copie o **Access Token** (começa com `TEST-`) e cole no `.env`.
4. Use os [cartões de teste do Mercado Pago](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/your-integrations/test/cards) para simular pagamentos aprovados/recusados sem mexer com dinheiro real.

### Webhook do Mercado Pago (confirmação de pagamento)

O pedido é confirmado no banco via `POST /api/webhooks/mercadopago`, que o Mercado Pago chama de forma assíncrona quando o status de um pagamento muda — isso garante que o pedido seja atualizado mesmo se o comprador fechar a aba antes de voltar pro app.

`auto_return` e `notification_url` só são enviados ao Mercado Pago quando `NEXTAUTH_URL` é `https://...` — a API do Mercado Pago rejeita `auto_return` com `back_urls` em `http` (erro `invalid_auto_return`), e não há como o Mercado Pago chamar um `notification_url` em `localhost` de qualquer forma. Rodando só com `http://localhost:3000`, o checkout continua funcionando normalmente, mas depois de pagar você precisa clicar no link "Voltar ao site" da própria tela do Mercado Pago para fechar o ciclo manualmente (sem redirect automático nem webhook).

Para testar o fluxo completo (redirect automático + webhook), use um túnel, por exemplo:

```bash
npx ngrok http 3000
```

E defina `NEXTAUTH_URL` com a URL pública do túnel (ex.: `https://xxxx.ngrok-free.app`) antes de criar um novo pedido/checkout, para que a `notification_url` enviada ao Mercado Pago seja alcançável.

Opcionalmente, configure a **chave secreta** do webhook em **Suas integrações → sua aplicação → Webhooks** no painel do Mercado Pago e coloque-a em `MERCADOPAGO_WEBHOOK_SECRET` — isso ativa a validação de assinatura (`x-signature`) da notificação recebida.

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
