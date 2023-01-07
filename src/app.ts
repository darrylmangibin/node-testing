import express, { Express } from 'express';
import 'colors';
import listEndpoints from 'express-list-endpoints';

class App {
  public app: Express = express();

  constructor(private port: number, routes: AppRoute[]) {}

  public listen() {
    this.app.listen(this.port, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV} at port ${this.port}`.blue.bold
      );
    });
  }

  public listEndpoints(path?: string) {
    console.table(
      listEndpoints(this.app).filter(endpoint =>
        path ? endpoint.path.includes(path) : endpoint
      )
    );

    process.exit();
  }
}

export default App;
