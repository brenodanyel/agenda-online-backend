import { Prisma } from '@prisma/client';
import { CustomError } from '../../helpers/error';
import { Repository as AuthRepository } from '../auth/auth.repository';
import { Repository as PaymentsRepository } from '../payments/payments.repository';

export class Service {
  constructor(
    private authModel = AuthRepository,
    private paymentsModel = PaymentsRepository,
  ) { };

  public async findByUser(id: string) {
    const user = await this.authModel.findFirst({ where: { id } });

    if (!user) {
      throw new CustomError(404, 'Usuário inválido');
    }

    const result = await this.paymentsModel.findMany({
      where: { userId: id },
    });

    return result;
  };

  public async createByUser(data: Prisma.PaymentsUncheckedCreateInput) {
    const payment = await this.paymentsModel.create({ data });
    return payment;
  }

  public async deleteByUser(userId: string, id: string) {
    const exists = await this.paymentsModel.findFirst({ where: { id, userId } });

    if (!exists) {
      throw new CustomError(404, 'Pagamento não encontrado');
    }

    await this.paymentsModel.deleteMany({ where: { id, userId } });
  }

  public async updateByUser(userId: string, id: string, data: Prisma.PaymentsUncheckedUpdateInput) {
    const exists = await this.paymentsModel.findFirst({ where: { id, userId } });

    if (!exists) {
      throw new CustomError(404, 'Pagamento não encontrado');
    }

    const payment = await this.paymentsModel.update({
      where: { id },
      data,
    });

    return payment;
  }
};
