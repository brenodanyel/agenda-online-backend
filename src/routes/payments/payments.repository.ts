import { Client } from '../../../prisma';

export class Repository {
  static create = Client.payments.create;
  static findMany = Client.payments.findMany;
  static findFirst = Client.payments.findFirst;
  static deleteMany = Client.payments.deleteMany;
  static update = Client.payments.update;
}
