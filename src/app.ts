import express, { Express, RequestHandler } from 'express';
import 'colors';
import listEndpoints from 'express-list-endpoints';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

import connectDatabase from '@/utils/database/connect.database';

class App {
  public app: Express = express();

  constructor(private port: number, routes: AppRoute[]) {
    this.initializeMiddleware(cors(), helmet(), compression(), morgan('dev'));
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
}

export default App;
