import { Router } from 'express';

declare global {
  interface AppRoute {
    path: string;
    router: Router;
    registerRoutes: () => void;
  }

  var app: Express;
}

export {};
