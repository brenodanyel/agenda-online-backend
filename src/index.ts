import 'dotenv/config';
import { App } from './app';

import { router as auth } from './routes/auth.route';

const app = new App();

app.addRoute('/auth', auth);

app.listen(Number(process.env.PORT) || 3001);
