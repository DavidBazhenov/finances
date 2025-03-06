import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Category, { CategoryType } from '../models/Category.js';
import defaultCategories from '../config/defaultCategories.js';

/**
 * Получение всех категорий пользователя
 * @route GET /api/categories
 * @access Private
 */
export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  // Получаем все категории пользователя и стандартные категории
  const categories = await Category.find({
    $or: [
      { userId: req.user._id },
      { isDefault: true }
    ]
  }).sort({ name: 1 });

  res.json(categories);
});

/**
 * Получение категорий по типу (расход/доход)
 * @route GET /api/categories/:type
 * @access Private
 */
export const getCategoriesByType = asyncHandler(async (req: Request, res: Response) => {
  const type = req.params.type as CategoryType;
  
  // Проверяем, что тип категории валиден
  if (!Object.values(CategoryType).includes(type)) {
    res.status(400);
    throw new Error('Неверный тип категории');
  }

  // Получаем категории указанного типа
  const categories = await Category.find({
    type,
    $or: [
      { userId: req.user._id },
      { isDefault: true }
    ]
  }).sort({ name: 1 });

  res.json(categories);
});

/**
 * Создание новой категории
 * @route POST /api/categories
 * @access Private
 */
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, type, icon, color } = req.body;

  // Проверяем, что тип категории валиден
  if (!Object.values(CategoryType).includes(type)) {
    res.status(400);
    throw new Error('Неверный тип категории');
  }

  // Проверяем, существует ли уже категория с таким именем у пользователя
  const categoryExists = await Category.findOne({
    name,
    type,
    userId: req.user._id
  });

  if (categoryExists) {
    res.status(400);
    throw new Error('Категория с таким именем уже существует');
  }

  // Создаем новую категорию
  const category = await Category.create({
    name,
    type,
    icon: icon || 'tag',
    color: color || '#6366F1',
    isDefault: false,
    userId: req.user._id
  });

  if (category) {
    res.status(201).json(category);
  } else {
    res.status(400);
    throw new Error('Недопустимые данные категории');
  }
});

/**
 * Обновление категории
 * @route PUT /api/categories/:id
 * @access Private
 */
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, icon, color } = req.body;

  // Находим категорию по ID
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Категория не найдена');
  }

  // Проверяем, что категория принадлежит пользователю и не является стандартной
  if (category.isDefault || !category.userId || category.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Нельзя изменить стандартную категорию или категорию другого пользователя');
  }

  // Обновляем категорию
  category.name = name || category.name;
  category.icon = icon || category.icon;
  category.color = color || category.color;

  const updatedCategory = await category.save();
  res.json(updatedCategory);
});

/**
 * Удаление категории
 * @route DELETE /api/categories/:id
 * @access Private
 */
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  // Находим категорию по ID
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Категория не найдена');
  }

  // Проверяем, что категория принадлежит пользователю и не является стандартной
  if (category.isDefault || !category.userId || category.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Нельзя удалить стандартную категорию или категорию другого пользователя');
  }

  await category.deleteOne();
  res.json({ message: 'Категория удалена' });
});

/**
 * Инициализация стандартных категорий
 * @route POST /api/categories/init-defaults
 * @access Private (только для администратора)
 */
export const initDefaultCategories = asyncHandler(async (req: Request, res: Response) => {
  // Удаляем все существующие стандартные категории
  await Category.deleteMany({ isDefault: true });

  // Создаем новые стандартные категории
  const createdCategories = await Category.insertMany(defaultCategories);

  res.status(201).json(createdCategories);
}); 