import 'module-alias/register';
import 'dotenv/config';

import App from '@/src/app';
import routes from '@/src/routes';

const PORT = Number(process.env.PORT || 3000);

const app = new App(PORT, routes);

app.listen();

export default app;
