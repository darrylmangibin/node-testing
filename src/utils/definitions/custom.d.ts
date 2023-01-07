import { Router } from 'express';
import { JwtPayload } from 'jsonwebtoken';

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

  interface AppPayload extends JwtPayload {
    id: string;
  }
}

export {};
