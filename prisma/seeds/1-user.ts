import { PrismaClient, User } from '@prisma/client';
import { Passwords } from '../../src/helpers/password';

const { encodeSync } = new Passwords();

const data: User[] = [
  {
    id: '1',
    username: 'user',
    email: 'user@test.com',
    password: encodeSync('senhasuperforte'),
  },
  {
    id: '2',
    username: 'otheruser',
    email: 'otheruser@test.com',
    password: encodeSync('senhasuperforte'),
  },
];

export const seed = async (client: PrismaClient) => client.user.createMany({ data, skipDuplicates: true });
