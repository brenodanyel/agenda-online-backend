import { Client } from '../../../prisma';

export class Repository {
  static findFirst = Client.user.findFirst;
  static create = Client.user.create;
  static update = Client.user.update;
}
