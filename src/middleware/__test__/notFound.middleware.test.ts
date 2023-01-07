import supertest from 'supertest';

import server from '@/src/server';

describe('notFoundMiddleware', () => {
  it('should throw 404 not found response when no routes found', async () => {
    const res = await supertest(server.app).get('/api/notfound');

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: 'Route not found',
        success: false,
      })
    );
  });
});
