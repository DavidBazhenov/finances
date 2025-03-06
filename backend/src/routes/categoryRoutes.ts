import express from 'express';
import {
  getCategories,
  getCategoriesByType,
  createCategory,
  updateCategory,
  deleteCategory,
  initDefaultCategories
} from '../controllers/categoryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Маршруты для категорий
router.route('/')
  .get(protect, getCategories)
  .post(protect, createCategory);

router.route('/type/:type')
  .get(protect, getCategoriesByType);

router.route('/init-defaults')
  .post(protect, initDefaultCategories);

router.route('/:id')
  .put(protect, updateCategory)
  .delete(protect, deleteCategory);

export default router; 