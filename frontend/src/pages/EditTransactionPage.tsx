import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../app/store';
import { 
  fetchTransactionById, 
  updateTransaction,
  clearTransactionDetails 
} from '../features/transactions/transactionSlice';
import { fetchCategoriesByType } from '../features/categories/categorySlice';
import { CategoryType } from '../features/categories/categorySlice';
import Loader from '../components/ui/Loader';

const EditTransactionPage = () => {
  const { id } = useParams<{ id: string }>();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { transaction, loading, error } = useSelector((state: RootState) => state.transactions);
  const { categories, loading: categoriesLoading } = useSelector(
    (state: RootState) => state.categories
  );
  
  useEffect(() => {
    if (id) {
      dispatch(fetchTransactionById(id));
    }
    
    return () => {
      dispatch(clearTransactionDetails());
    };
  }, [dispatch, id]);
  
  useEffect(() => {
    if (transaction) {
      setAmount(transaction.amount.toString());
      setDescription(transaction.description);
      setDate(new Date(transaction.date).toISOString().split('T')[0]);
      setCategoryId(transaction.categoryId._id);
      
      dispatch(fetchCategoriesByType(transaction.type));
    }
  }, [dispatch, transaction]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!transaction || !id) return;
    
    const transactionData = {
      amount: parseFloat(amount),
      description,
      date,
      categoryId,
    };
    
    dispatch(updateTransaction({ id, transactionData }))
      .unwrap()
      .then(() => {
        navigate('/transactions');
      })
      .catch((err) => {
        console.error('Ошибка при обновлении транзакции:', err);
      });
  };
  
  const isFormValid = () => {
    return (
      amount &&
      parseFloat(amount) > 0 &&
      description.trim() !== '' &&
      date &&
      categoryId
    );
  };
  
  if (loading) return <Loader />;
  
  if (!transaction && !loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Транзакция не найдена
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/transactions')}
        >
          Вернуться к списку транзакций
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Редактирование транзакции</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="card">
        {transaction && (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Тип транзакции</label>
              <div className="text-gray-700 font-medium">
                {transaction.type === CategoryType.EXPENSE ? 'Расход' : 'Доход'}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Тип транзакции изменить нельзя. Если нужно, создайте новую транзакцию.
              </p>
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
        )}
      </div>
    </div>
  );
};

export default EditTransactionPage; 