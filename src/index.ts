import 'dotenv/config';
import { App } from './app';

import { router as auth } from './routes/auth.route';
import { router as payments } from './routes/payments.route';

const app = new App();

app.addRoute('/auth', auth);
app.addRoute('/payments', payments);

app.listen(Number(process.env.PORT) || 3001);
