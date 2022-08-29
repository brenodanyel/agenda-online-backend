import { PrismaClient, Payments } from '@prisma/client';

const data: Payments[] = [
  {
    id: '1',
    customer: 'Fulano de tal',
    date: new Date(),
    installments: 5,
    price: 500,
    userId: '1',
  },
  {
    id: '2',
    customer: 'Outro fulano',
    date: new Date(),
    installments: 10,
    price: 250,
    userId: '1',
  },
];

export const seed = async (client: PrismaClient) => client.payments.createMany({ data, skipDuplicates: true });
