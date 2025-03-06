import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../app/store';
import { createTransaction } from '../features/transactions/transactionSlice';
import { fetchCategoriesByType } from '../features/categories/categorySlice';
import { CategoryType } from '../features/categories/categorySlice';
import Loader from '../components/ui/Loader';

const AddTransactionPage = () => {
  const [type, setType] = useState<CategoryType>(CategoryType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { loading, error } = useSelector((state: RootState) => state.transactions);
  const { categories, loading: categoriesLoading } = useSelector(
    (state: RootState) => state.categories
  );
  
  useEffect(() => {
    dispatch(fetchCategoriesByType(type));
  }, [dispatch, type]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(type, amount, description, date, categoryId);
    const transactionData = {
      type,
      amount: parseFloat(amount),
      description,
      date,
      categoryId,
    };
    
    dispatch(createTransaction(transactionData))
      .unwrap()
      .then(() => {
        navigate('/transactions');
      })
      .catch((err) => {
        console.error('Ошибка при создании транзакции:', err);
      });
  };
  const isFormValid = () => {
    return (
      type &&
      amount &&
      parseFloat(amount) > 0 &&
      description.trim() !== '' &&
      date &&
      categoryId
    );
  };
  console.log(categories);
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Добавить транзакцию</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Тип транзакции</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value={CategoryType.EXPENSE}
                  checked={type === CategoryType.EXPENSE}
                  onChange={() => {
                    setType(CategoryType.EXPENSE);
                    setCategoryId(''); // Сбрасываем выбранную категорию при смене типа
                  }}
                  className="mr-2"
                />
                Расход
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value={CategoryType.INCOME}
                  checked={type === CategoryType.INCOME}
                  onChange={() => {
                    setType(CategoryType.INCOME);
                    setCategoryId(''); // Сбрасываем выбранную категорию при смене типа
                  }}
                  className="mr-2"
                />
                Доход
              </label>
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 font-medium mb-2">
              Сумма
            </label>
            <input
              type="number"
              id="amount"
              className="input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
              Категория
            </label>
            {categoriesLoading ? (
              <Loader />
            ) : (
              <select
                id="category"
                className="input"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Описание
            </label>
            <input
              type="text"
              id="description"
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="date" className="block text-gray-700 font-medium mb-2">
              Дата
            </label>
            <input
              type="date"
              id="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/transactions')}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !isFormValid()}
            >
              {loading ? <Loader /> : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionPage; 