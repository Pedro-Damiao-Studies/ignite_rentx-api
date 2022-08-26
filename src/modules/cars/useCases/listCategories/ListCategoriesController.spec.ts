import { hash } from 'bcryptjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

describe('List Categories Controller', () => {
  let connection: Connection;
  const email = 'admin@rentx.com';
  const password = 'admin';

  beforeAll(async () => {
    connection = await createConnection('localhost');
    await connection.runMigrations();

    const id = uuidV4();
    const passwordHash = await hash(password, 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, driver_license, is_admin, created_at)
      VALUES ('${id}', 'admin', '${email}', '${passwordHash}', '999999999', true, now())`
    );
  });

  afterAll(async () => {
    await connection?.dropDatabase();
    await connection?.close();
  });

  it('should be able to list all categories', async () => {
    const responseToken = await request(app).post('/sessions').send({
      email,
      password,
    });

    const { token } = responseToken.body;

    await request(app)
      .post('/categories')
      .send({
        name: 'Category supertest',
        description: 'Category supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app).get('/categories');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });
});
