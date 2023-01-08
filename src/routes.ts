import AuthRoutes from '@/resources/auth/auth.routes';
import UserRoutes from '@/resources/user/auth.routes';

const routes: AppRoute[] = [new AuthRoutes(), new UserRoutes()];

export default routes;
