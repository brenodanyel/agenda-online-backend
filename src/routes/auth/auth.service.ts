import { CustomError } from '../../helpers/error';
import { Token } from '../../helpers/token';
import { Passwords } from '../../helpers/password';
import { Repository as AuthRepository } from './auth.repository';

export class Service {
  constructor(
    private authRepository = AuthRepository,
    private passwords = new Passwords(),
    private token = new Token(),
  ) { }

  public async login(username: string, rawPassword: string) {
    const user = await this.authRepository.findFirst({ where: { username } });

    if (!user) {
      throw new CustomError(404, 'Usuário ou senha incorreta');
    }

    const correctPass = await this.passwords.compare(rawPassword, user.password);

    if (!correctPass) {
      throw new CustomError(404, 'Usuário ou senha incorreta');
    }

    const { password, ...userWithoutPassword } = user;

    const token = await this.token.generate({ user: userWithoutPassword });

    return {
      token,
      user: userWithoutPassword,
    };
  };

  public async register(username: string, email: string, rawPassword: string) {
    const foundUser = await this.authRepository.findFirst({ where: { OR: [{ username }, { email }] } });

    if (foundUser) {
      throw new CustomError(409, 'Usuário já cadastrado');
    }

    const encryptedPassword = await this.passwords.encode(rawPassword);

    const user = await this.authRepository.create({
      data: { username, email, password: encryptedPassword },
      select: { password: false },
    });

    const token = await this.token.generate({ user });

    return { token, user };
  }

  public async verify(token: string) {
    try {
      const result = await this.token.verify(token);
      return result;
    } catch (e) {
      throw new CustomError(400, 'Token inválido');
    }
  }
};
