import { Payments, Prisma } from '@prisma/client';
import { CustomError } from '../../helpers/error';
import { Repository as AuthRepository } from '../auth/auth.repository';
import { Repository as PaymentsRepository } from '../payments/payments.repository';

export class Service {
  constructor(
    private authModel = AuthRepository,
    private paymentsModel = PaymentsRepository,
  ) { };

  static FilterByDate = (list: Payments[], rawMinDate: Date, rawMaxDate: Date): Payments[] => {
    const minDate = new Date(rawMinDate);
    minDate.setHours(0, 0, 0, 0);

    const maxDate = new Date(rawMaxDate);
    maxDate.setHours(0, 0, 0, 0);

    const isBetween = (date: Date) => (date >= minDate && date <= maxDate);

    return list.filter((payment) => {
      const startPaymentDate = new Date(payment.date);
      startPaymentDate.setHours(0, 0, 0, 0);

      const endPaymentDate = new Date(payment.date);
      endPaymentDate.setHours(0, 0, 0, 0);
      endPaymentDate.setMonth(startPaymentDate.getMonth() + payment.installments);

      if (isBetween(startPaymentDate)) return true;
      if (isBetween(endPaymentDate)) return true;

      if (minDate.toISOString() === startPaymentDate.toISOString()) return true;
      if (minDate.toISOString() === endPaymentDate.toISOString()) return true;

      if (maxDate.toISOString() === startPaymentDate.toISOString()) return true;
      if (maxDate.toISOString() === endPaymentDate.toISOString()) return true;

      if ((minDate >= startPaymentDate) && (maxDate <= endPaymentDate)) return true;

      return false;
    });
  };

  public async findByUser(id: string, startDate?: Date, endDate?: Date) {
    const user = await this.authModel.findFirst({ where: { id } });

    if (!user) {
      throw new CustomError(404, 'Usuário inválido');
    }

    const result = await this.paymentsModel.findMany({
      where: { userId: id },
    });

    if (startDate && endDate) {
      return Service.FilterByDate(result, startDate, endDate);
    }

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
