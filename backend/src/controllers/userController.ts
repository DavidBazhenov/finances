import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/**
 * Авторизация пользователя и выдача токена
 * @route POST /api/users/login
 * @access Public
 */
export const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Находим пользователя по email
  const user = await User.findOne({ email });

  // Проверяем существование пользователя и соответствие пароля
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Неверный email или пароль');
  }
});

/**
 * Регистрация нового пользователя
 * @route POST /api/users
 * @access Public
 */
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Проверяем, существует ли пользователь с таким email
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('Пользователь с таким email уже существует');
  }

  // Создаем нового пользователя
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    // Возвращаем данные созданного пользователя
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Недопустимые данные пользователя');
  }
});

/**
 * Получение профиля пользователя
 * @route GET /api/users/profile
 * @access Private
 */
export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('Пользователь не найден');
  }
});

/**
 * Обновление профиля пользователя
 * @route PUT /api/users/profile
 * @access Private
 */
export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('Пользователь не найден');
  }
}); 