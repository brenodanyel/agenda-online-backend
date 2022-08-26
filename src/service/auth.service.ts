import { PrismaClient } from '@prisma/client';
import { Client } from '../../prisma';
import { CustomError } from '../helpers/error';
import { Token } from '../helpers/token';
import { Passwords } from '../helpers/password';

export class Service {
  private model: PrismaClient;
  private passwords: Passwords;
  private token: Token;

  constructor(model = Client, passwords = new Passwords(), token = new Token()) {
    this.model = model;
    this.passwords = passwords;
    this.token = token;
  };

  public async login(username: string, rawPassword: string) {
    const user = await this.model.user.findFirst({ where: { username } });

    if (!user) {
      throw new CustomError(404, 'Usuário ou senha incorreta');
    }

    const correctPass = await this.passwords.compare(rawPassword, user.password);

    if (!correctPass) {
      throw new CustomError(404, 'Usuário ou senha incorreta');
    }

    const { password, ...userWithoutPassword } = user;

    const token = await this.token.generate(userWithoutPassword);

    return {
      token,
      user: userWithoutPassword,
    };
  };
};
