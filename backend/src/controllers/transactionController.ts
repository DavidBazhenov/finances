import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import Category, { CategoryType } from '../models/Category.js';

/**
 * Получение всех транзакций пользователя
 * @route GET /api/transactions
 * @access Private
 */
export const getTransactions = asyncHandler(async (req: Request, res: Response) => {
  // Получаем параметры запроса для фильтрации и пагинации
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
  const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
  const type = req.query.type as CategoryType | undefined;
  const categoryId = req.query.categoryId as string | undefined;

  // Создаем фильтр для запроса
  const filter: any = { userId: req.user._id };

  // Добавляем фильтр по типу транзакции
  if (type && Object.values(CategoryType).includes(type)) {
    filter.type = type;
  }

  // Добавляем фильтр по категории
  if (categoryId) {
    filter.categoryId = categoryId;
  }

  // Добавляем фильтр по дате
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      filter.date.$gte = startDate;
    }
    if (endDate) {
      filter.date.$lte = endDate;
    }
  }

  // Получаем общее количество транзакций для пагинации
  const total = await Transaction.countDocuments(filter);

  // Получаем транзакции с пагинацией и сортировкой по дате (сначала новые)
  const transactions = await Transaction.find(filter)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('categoryId', 'name icon color');

  res.json({
    transactions,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

/**
 * Получение транзакции по ID
 * @route GET /api/transactions/:id
 * @access Private
 */
export const getTransactionById = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate('categoryId', 'name icon color');

  if (!transaction) {
    res.status(404);
    throw new Error('Транзакция не найдена');
  }

  // Проверяем, что транзакция принадлежит пользователю
  if (transaction.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Доступ запрещен');
  }

  res.json(transaction);
});

/**
 * Создание новой транзакции
 * @route POST /api/transactions
 * @access Private
 */
export const createTransaction = asyncHandler(async (req: Request, res: Response) => {
  const { type, amount, description, date, categoryId } = req.body;

  // Проверяем, что тип транзакции валиден
  if (!Object.values(CategoryType).includes(type)) {
    res.status(400);
    throw new Error('Неверный тип транзакции');
  }

  // Проверяем, что сумма положительная
  if (amount <= 0) {
    res.status(400);
    throw new Error('Сумма должна быть положительной');
  }

  // Проверяем, что категория существует и соответствует типу транзакции
  const category = await Category.findById(categoryId);
  if (!category) {
    res.status(404);
    throw new Error('Категория не найдена');
  }

  if (category.type !== type) {
    res.status(400);
    throw new Error('Тип категории не соответствует типу транзакции');
  }

  // Проверяем, что категория принадлежит пользователю или является стандартной
  if (!category.isDefault && category.userId && category.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Нельзя использовать категорию другого пользователя');
  }

  // Создаем новую транзакцию
  const transaction = await Transaction.create({
    type,
    amount,
    description,
    date: date || new Date(),
    categoryId,
    userId: req.user._id
  });

  if (transaction) {
    const populatedTransaction = await Transaction.findById(transaction._id)
      .populate('categoryId', 'name icon color');
    res.status(201).json(populatedTransaction);
  } else {
    res.status(400);
    throw new Error('Недопустимые данные транзакции');
  }
});

/**
 * Обновление транзакции
 * @route PUT /api/transactions/:id
 * @access Private
 */
export const updateTransaction = asyncHandler(async (req: Request, res: Response) => {
  const { amount, description, date, categoryId } = req.body;

  // Находим транзакцию по ID
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Транзакция не найдена');
  }

  // Проверяем, что транзакция принадлежит пользователю
  if (transaction.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Доступ запрещен');
  }

  // Если указана новая категория, проверяем ее
  if (categoryId && categoryId !== transaction.categoryId.toString()) {
    const category = await Category.findById(categoryId);
    
    if (!category) {
      res.status(404);
      throw new Error('Категория не найдена');
    }

    if (category.type !== transaction.type) {
      res.status(400);
      throw new Error('Тип категории не соответствует типу транзакции');
    }

    if (!category.isDefault && category.userId && category.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Нельзя использовать категорию другого пользователя');
    }
  }

  // Обновляем транзакцию
  transaction.amount = amount || transaction.amount;
  transaction.description = description || transaction.description;
  transaction.date = date ? new Date(date) : transaction.date;
  if (categoryId) {
    transaction.categoryId = categoryId as any;
  }

  const updatedTransaction = await transaction.save();
  
  const populatedTransaction = await Transaction.findById(updatedTransaction._id)
    .populate('categoryId', 'name icon color');
  
  res.json(populatedTransaction);
});

/**
 * Удаление транзакции
 * @route DELETE /api/transactions/:id
 * @access Private
 */
export const deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
  // Находим транзакцию по ID
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction) {
    res.status(404);
    throw new Error('Транзакция не найдена');
  }

  // Проверяем, что транзакция принадлежит пользователю
  if (transaction.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Доступ запрещен');
  }

  await transaction.deleteOne();
  res.json({ message: 'Транзакция удалена' });
});

/**
 * Получение статистики по транзакциям
 * @route GET /api/transactions/stats
 * @access Private
 */
export const getTransactionStats = asyncHandler(async (req: Request, res: Response) => {
  // Получаем параметры запроса для фильтрации
  const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(new Date().setMonth(new Date().getMonth() - 1));
  const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();

  // Создаем фильтр для запроса
  const filter = {
    userId: req.user._id,
    date: { $gte: startDate, $lte: endDate }
  };

  // Получаем статистику по категориям расходов
  const expenseStats = await Transaction.aggregate([
    { $match: { ...filter, type: CategoryType.EXPENSE } },
    { $group: {
        _id: '$categoryId',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    { $project: {
        _id: 1,
        total: 1,
        count: 1,
        name: '$category.name',
        icon: '$category.icon',
        color: '$category.color'
      }
    },
    { $sort: { total: -1 } }
  ]);

  // Получаем статистику по категориям доходов
  const incomeStats = await Transaction.aggregate([
    { $match: { ...filter, type: CategoryType.INCOME } },
    { $group: {
        _id: '$categoryId',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category'
      }
    },
    { $unwind: '$category' },
    { $project: {
        _id: 1,
        total: 1,
        count: 1,
        name: '$category.name',
        icon: '$category.icon',
        color: '$category.color'
      }
    },
    { $sort: { total: -1 } }
  ]);

  // Получаем общую сумму расходов и доходов
  const totalExpense = expenseStats.reduce((sum, stat) => sum + stat.total, 0);
  const totalIncome = incomeStats.reduce((sum, stat) => sum + stat.total, 0);

  // Получаем статистику по дням
  const dailyStats = await Transaction.aggregate([
    { $match: filter },
    { $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          type: '$type'
        },
        total: { $sum: '$amount' }
      }
    },
    { $sort: { '_id.date': 1 } }
  ]);

  res.json({
    expenseStats,
    incomeStats,
    totalExpense,
    totalIncome,
    balance: totalIncome - totalExpense,
    dailyStats
  });
}); 