import server from '@/src/server';
import supertest from 'supertest';

export interface AuthSupertest<T = {}> {
  method: 'PUT' | 'GET' | 'DELETE' | 'PATCH' | 'POST';
  endpoint: string;
  token: string;
  body?: T;
}

function authSupertest<T extends {} = {}>(
  method: AuthSupertest['method'],
  endpoint: AuthSupertest['endpoint'],
  token?: AuthSupertest['token'],
  body?: AuthSupertest<Partial<T>>['body']
) {
  switch (method) {
    case 'GET':
      return supertest(server.app).get(endpoint).set('Authorization', `Bearer ${token}`);
    case 'PATCH':
      return supertest(server.app)
        .patch(endpoint)
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    case 'PUT':
      return supertest(server.app)
        .put(endpoint)
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    case 'POST':
      return supertest(server.app)
        .post(endpoint)
        .set('Authorization', `Bearer ${token}`)
        .send(body);
    case 'DELETE':
      return supertest(server.app)
        .delete(endpoint)
        .set('Authorization', `Bearer ${token}`);
  }
}

export default authSupertest;
