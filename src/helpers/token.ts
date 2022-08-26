import jwt from 'jsonwebtoken';

const { JWT_KEY = "qualquer senha" } = process.env;

export class Token {
  private key = JWT_KEY;

  public async generate(payload: jwt.JwtPayload) {
    return jwt.sign(payload, this.key);
  }

  public async verify(token: string) {
    return jwt.verify(token, this.key);
  };
}
