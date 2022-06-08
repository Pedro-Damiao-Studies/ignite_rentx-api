/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';

import 'express-async-errors';

import 'reflect-metadata';

import './database';

import './shared/container';

import { AppError } from './errors/AppError';
import { router } from './routes';
import swaggerFile from './swagger.json';

const app = express();

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

app.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }
  return response.status(500).json({
    status: 'error',
    message: `Internal server error - ${error.message}`,
  });
});

app.listen(3333, () => console.log('Server is running on port 3333'));
