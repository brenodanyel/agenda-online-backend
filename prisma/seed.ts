import fs from 'node:fs';
import { Client } from '.';

const runSeed = async () => {
  try {
    const path = `${__dirname}/seeds`;

    for (const file of fs.readdirSync(path)) {
      const fullPath = `${path}/${file}`;
      const result = await import(fullPath);
      await result.seed(Client);
    }

  } catch (e) {
    console.log(e);

  } finally {
    Client.$disconnect();

  }
};

runSeed();
