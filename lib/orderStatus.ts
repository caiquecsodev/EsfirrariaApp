export const orderStatusLabels: Record<string, string> = {
  PENDING: "Aguardando pagamento",
  CONFIRMED: "Pagamento confirmado",
  PREPARING: "Em preparo",
  READY: "Pronto",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
};

export const orderStatusStyles: Record<string, string> = {
  PENDING: "bg-orange-50 text-orange-700",
  CONFIRMED: "bg-green-50 text-green-700",
  PREPARING: "bg-orange-50 text-orange-700",
  READY: "bg-green-50 text-green-700",
  DELIVERED: "bg-neutral-100 text-neutral-600",
  CANCELED: "bg-red-50 text-red-700",
};
