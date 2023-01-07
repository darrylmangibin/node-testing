import express, { Express } from 'express';
import 'colors';

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
}

export default App;
