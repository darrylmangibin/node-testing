import express, { Express, RequestHandler } from 'express';
import 'colors';
import listEndpoints from 'express-list-endpoints';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import connectDatabase from '@/utils/database/connect.database';
import notFoundMiddleware from '@/middleware/notFound.middleware';
import errorMiddleware from '@/middleware/error.middleware';

class App {
  public app: Express = express();

  constructor(private port: number, routes: AppRoute[]) {
    this.initializeMiddleware(cors(), helmet(), compression(), morgan('dev'));
    this.initializeRoutes(routes);

    this.initializeNotFoundRoute();
    this.initializeErrorMiddleware();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} at port ${this.port}`.blue.bold
      );
    });
    this.initializeDatabaseConnection();
  }

  public listEndpoints = (path?: string) => {
    console.table(
      listEndpoints(this.app).filter(endpoint =>
        path ? endpoint.path.includes(path) : endpoint
      )
    );
  };

  private initializeDatabaseConnection() {
    connectDatabase('MongoDB connected');
  }

  private initializeMiddleware(...handlers: RequestHandler[]) {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));

    handlers.forEach(handler => {
      this.app.use(handler);
    });
  }

  private initializeRoutes(routes: AppRoute[]) {
    routes.forEach(route => {
      this.app.use(`/api/${route.path}`, route.router);
    });
  }

  private initializeNotFoundRoute() {
    this.app.use(notFoundMiddleware);
  }

  private initializeErrorMiddleware() {
    this.app.use(errorMiddleware);
  }
}

export default App;
