import App from '@/src/app';
import routes from '@/src/routes';

const PORT = Number(process.env.PORT || 3000);

export const server = new App(PORT, routes);

export default server;
