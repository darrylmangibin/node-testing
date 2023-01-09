import AuthRoutes from '@/resources/auth/auth.routes';
import UserRoutes from '@/resources/user/user.routes';
import PostRoutes from '@/resources/post/post.routes';
import CommentRoutes from '@/resources/comment/comment.routes';

const routes: AppRoute[] = [
  new AuthRoutes(),
  new UserRoutes(),
  new PostRoutes(),
  new CommentRoutes(),
];

export default routes;
