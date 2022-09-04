import { Payments } from '@prisma/client';

export const VALID_PAYMENT: Payments = {
  id: '1',
  customer: "Customer name",
  date: new Date(),
  installments: 5,
  price: 120,
  userId: '1',
};
