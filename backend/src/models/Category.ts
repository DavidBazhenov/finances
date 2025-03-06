import mongoose from 'mongoose';

// Определение перечисления для типа категории
export enum CategoryType {
  EXPENSE = 'expense',
  INCOME = 'income'
}

// Определение интерфейса для категории
export interface ICategory {
  name: string;
  type: CategoryType;
  icon?: string;
  color?: string;
  isDefault: boolean;
  userId?: mongoose.Schema.Types.ObjectId;
}

// Создание схемы Mongoose для категории
const categorySchema = new mongoose.Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: Object.values(CategoryType),
      required: true
    },
    icon: {
      type: String,
      default: 'tag'
    },
    color: {
      type: String,
      default: '#6366F1' // Индиго по умолчанию
    },
    isDefault: {
      type: Boolean,
      default: false
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false // null для стандартных категорий
    }
  },
  {
    timestamps: true
  }
);

// Создание индекса для повышения производительности запросов
categorySchema.index({ userId: 1, type: 1 });

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category; 