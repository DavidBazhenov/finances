import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

/**
 * Генерирует JWT-токен для авторизации пользователя
 * @param id ID пользователя
 * @returns JWT-токен
 */
const generateToken = (id: string | Types.ObjectId): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: '30d', // Токен действителен 30 дней
  });
};

export default generateToken; 