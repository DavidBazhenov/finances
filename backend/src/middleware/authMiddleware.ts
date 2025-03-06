import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Расширение типа Request для добавления пользователя
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

// Middleware для защиты маршрутов
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // Проверка наличия токена и его корректности
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Получение токена из заголовка
      token = req.headers.authorization.split(' ')[1];

      // Проверка токена
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      // Получение данных пользователя (без пароля)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Не авторизован, неверный токен');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Не авторизован, токен отсутствует');
  }
}; 