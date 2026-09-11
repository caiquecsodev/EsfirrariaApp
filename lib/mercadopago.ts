import { MercadoPagoConfig, Payment, Preference } from "mercadopago";

const mercadoPagoConfig = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export const preferenceClient = new Preference(mercadoPagoConfig);
export const paymentClient = new Payment(mercadoPagoConfig);
