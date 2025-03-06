import mongoose from 'mongoose';
import { CategoryType } from './Category.js';

// Определение интерфейса для транзакции
export interface ITransaction {
  type: CategoryType;
  amount: number;
  description: string;
  date: Date;
  categoryId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
}

// Создание схемы Mongoose для транзакции
const transactionSchema = new mongoose.Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: Object.values(CategoryType),
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Создаем индексы для повышения производительности запросов
transactionSchema.index({ userId: 1 });
transactionSchema.index({ date: -1 });
transactionSchema.index({ categoryId: 1 });
transactionSchema.index({ type: 1 });

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction; 