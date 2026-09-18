# TODO

Itens levantados em 2026-09-18, ainda não implementados.

## 1. "Pedir de novo" (repetir pedido anterior)

Na tela de detalhes/histórico de um pedido já feito, dar a opção de repetir o mesmo pedido (mesmos itens) sem precisar montar o carrinho de novo — comum pra quem sempre pede a mesma coisa.

## 2. Expirar pedidos não pagos após 30 minutos

Se o cliente cria o pedido mas não conclui o pagamento, o pedido deve sumir de "Meus pedidos" (ou ser marcado como cancelado/expirado) depois de 30 minutos sem confirmação — hoje ele fica `PENDING` indefinidamente.

Precisa decidir: cron/job periódico que varre pedidos `PENDING` mais velhos que 30 min, ou checagem "preguiçosa" na hora de listar os pedidos (filtrando/atualizando os expirados na própria query). Também decidir se o pedido é deletado ou só marcado como `CANCELED`/expirado (pra manter histórico).

## 3. Preencher a tela final de pedido confirmado

A tela de detalhes do pedido ([app/pedidos/[id]/page.tsx](app/pedidos/%5Bid%5D/page.tsx)) fica muito vazia depois do pagamento confirmado. Adicionar:

- Mensagem de prazo, ex.: "Seu pedido ficará pronto em 30 minutos".
- Mensagem de agradecimento, ex.: "Ficamos felizes com seu pedido!".
- Algo tipo "saiba mais sobre nossa empresa" (link/seção institucional) pra ocupar espaço e dar mais contexto.

## Observação (não mexer agora)

O botão de "Voltar" do lado dos itens no topo/menu está com o estilo feio — ajustar o visual depois, não é prioridade agora.
