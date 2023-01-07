import { Router } from 'express';

declare global {
  interface AppRoute {
    path: string;
    router: Router;
    registerRoutes: () => void;
  }

  interface AppTimestamps {
    createdAt: Date;
    updatedAt: Date;
  }
}

export {};
