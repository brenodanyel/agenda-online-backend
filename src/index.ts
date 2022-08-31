import 'dotenv/config';
import { App } from './app';

import { Router as Auth } from './routes/auth/auth.route';
import { Router as Payments } from './routes/payments/payments.route';

const app = new App();

app.addRoute('/auth', new Auth().router);
app.addRoute('/payments', new Payments().router);

app.listen(Number(process.env.PORT) || 3001);
