import { PrismaClient, Prisma } from '@prisma/client';
import { Client } from '../../prisma';
import { CustomError } from '../helpers/error';

export class Service {
  private model: PrismaClient;

  constructor(model = Client) {
    this.model = model;
  };

  public async findByUser(id: string) {
    const user = await this.model.user.findFirst({ where: { id } });

    if (!user) {
      throw new CustomError(404, 'Usuário inválido');
    }

    const result = await this.model.payments.findMany({
      where: { userId: id },
    });

    return result;
  };

  public async createByUser(data: Prisma.PaymentsUncheckedCreateInput) {
    const payment = await this.model.payments.create({ data });
    return payment;
  }

  public async deleteByUser(userId: string, id: string) {
    const exists = await this.model.payments.findFirst({ where: { id, userId } });

    if (!exists) {
      throw new CustomError(404, 'Pagamento não encontrado');
    }

    await this.model.payments.deleteMany({ where: { id, userId } });
  }

  public async updateByUser(userId: string, id: string, data: Prisma.PaymentsUncheckedUpdateInput) {
    const exists = await this.model.payments.findFirst({ where: { id, userId } });

    if (!exists) {
      throw new CustomError(404, 'Pagamento não encontrado');
    }

    const payment = await this.model.payments.update({
      where: { id },
      data,
    });

    return payment;
  }
};
