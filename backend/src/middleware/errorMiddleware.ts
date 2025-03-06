import { Request, Response, NextFunction } from 'express';

// Middleware для обработки маршрутов, которые не найдены
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Не найдено - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Middleware для обработки ошибок
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Установка статуса 500 (Internal Server Error) если статус все еще 200
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
}; 