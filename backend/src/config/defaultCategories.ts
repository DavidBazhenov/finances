import { CategoryType } from '../models/Category.js';

interface DefaultCategory {
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  isDefault: boolean;
}

const defaultCategories: DefaultCategory[] = [
  // Категории расходов
  {
    name: 'Продукты',
    type: CategoryType.EXPENSE,
    icon: 'shopping-cart',
    color: '#EF4444', // Красный
    isDefault: true,
  },
  {
    name: 'Транспорт',
    type: CategoryType.EXPENSE,
    icon: 'truck',
    color: '#F59E0B', // Желтый
    isDefault: true,
  },
  {
    name: 'Жилье',
    type: CategoryType.EXPENSE,
    icon: 'home',
    color: '#10B981', // Зеленый
    isDefault: true,
  },
  {
    name: 'Развлечения',
    type: CategoryType.EXPENSE,
    icon: 'ticket',
    color: '#8B5CF6', // Фиолетовый
    isDefault: true,
  },
  {
    name: 'Здоровье',
    type: CategoryType.EXPENSE,
    icon: 'heart',
    color: '#EC4899', // Розовый
    isDefault: true,
  },
  {
    name: 'Одежда',
    type: CategoryType.EXPENSE,
    icon: 'shopping-bag',
    color: '#6366F1', // Индиго
    isDefault: true,
  },
  {
    name: 'Рестораны',
    type: CategoryType.EXPENSE,
    icon: 'utensils',
    color: '#F97316', // Оранжевый
    isDefault: true,
  },
  {
    name: 'Счета',
    type: CategoryType.EXPENSE,
    icon: 'receipt',
    color: '#0EA5E9', // Голубой
    isDefault: true,
  },
  
  // Категории доходов
  {
    name: 'Зарплата',
    type: CategoryType.INCOME,
    icon: 'cash',
    color: '#10B981', // Зеленый
    isDefault: true,
  },
  {
    name: 'Подработка',
    type: CategoryType.INCOME,
    icon: 'briefcase',
    color: '#8B5CF6', // Фиолетовый
    isDefault: true,
  },
  {
    name: 'Инвестиции',
    type: CategoryType.INCOME,
    icon: 'chart-line',
    color: '#F59E0B', // Желтый
    isDefault: true,
  },
  {
    name: 'Подарки',
    type: CategoryType.INCOME,
    icon: 'gift',
    color: '#EC4899', // Розовый
    isDefault: true,
  },
  {
    name: 'Возврат средств',
    type: CategoryType.INCOME,
    icon: 'undo',
    color: '#6366F1', // Индиго
    isDefault: true,
  }
];

export default defaultCategories; 