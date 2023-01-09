import AuthRoutes from '@/resources/auth/auth.routes';
import UserRoutes from '@/resources/user/auth.routes';
import PostRoutes from '@/resources/post/post.routes';

const routes: AppRoute[] = [new AuthRoutes(), new UserRoutes(), new PostRoutes()];

export default routes;
