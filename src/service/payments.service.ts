import { PrismaClient } from '@prisma/client';
import { Client } from '../../prisma';
import { CustomError } from '../helpers/error';
import { Token } from '../helpers/token';

export class Service {
  private model: PrismaClient;
  private token: Token;

  constructor(model = Client, token = new Token()) {
    this.model = model;
    this.token = token;
  };

  public async findByUser(id: string) {
    const user = await this.model.user.findFirst({ where: { id } });

    if (!user) {
      throw new CustomError(404, 'Usuário inválido');
    }

    const result = [];

    for (let i = 0; i <= 100; i += 1) {
      result.push({
        id: i,
        customer: `Nome do cliente ${i}`,
        date: new Date(),
        price: Math.ceil(Math.random() * 30),
        installments: Math.ceil(Math.random() * 30)
      });
    }

    return result;
  };
};
