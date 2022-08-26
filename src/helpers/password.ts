import bcryptjs from 'bcryptjs';

export class Passwords {
  private salt: string;

  constructor() {
    this.salt = bcryptjs.genSaltSync(10);

    this.encode = this.encode.bind(this);
    this.encodeSync = this.encodeSync.bind(this);
    this.compare = this.compare.bind(this);
  }

  public async encode(raw: string) {
    return bcryptjs.hash(raw, this.salt);
  }

  public encodeSync(raw: string) {
    return bcryptjs.hashSync(raw, this.salt);
  }

  public async compare(raw: string, hash: string) {
    return bcryptjs.compare(raw, hash);
  };
}
