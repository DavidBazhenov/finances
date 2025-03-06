import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../app/store';
import { fetchTransactions, deleteTransaction } from '../features/transactions/transactionSlice';
import { fetchCategories } from '../features/categories/categorySlice';
import { CategoryType } from '../features/categories/categorySlice';
import Loader from '../components/ui/Loader';

const TransactionsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, loading, error, page, pages, total } = useSelector(
    (state: RootState) => state.transactions
  );
  const { categories } = useSelector((state: RootState) => state.categories);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState<CategoryType | ''>('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  
  useEffect(() => {
    dispatch(
      fetchTransactions({
        page: currentPage,
        type: filterType || undefined,
        categoryId: filterCategory || undefined,
        startDate: filterStartDate || undefined,
        endDate: filterEndDate || undefined,
      })
    );
  }, [dispatch, currentPage, filterType, filterCategory, filterStartDate, filterEndDate]);
  
  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту транзакцию?')) {
      dispatch(deleteTransaction(id));
    }
  };
  
  const resetFilters = () => {
    setFilterType('');
    setFilterCategory('');
    setFilterStartDate('');
    setFilterEndDate('');
    setCurrentPage(1);
  };
  
  // Получение категорий по типу для фильтра
  const filteredCategories = filterType
    ? categories.filter((cat) => cat.type === filterType)
    : categories;
  
  // Форматирование даты для отображения
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Транзакции</h1>
        <Link to="/transactions/add" className="btn btn-primary">
          Добавить транзакцию
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Фильтры */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold mb-4">Фильтры</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Тип</label>
            <select
              className="input"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value as CategoryType | '');
                setFilterCategory(''); // Сбрасываем выбранную категорию при смене типа
              }}
            >
              <option value="">Все</option>
              <option value={CategoryType.EXPENSE}>Расходы</option>
              <option value={CategoryType.INCOME}>Доходы</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Категория</label>
            <select
              className="input"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              disabled={!filterType}
            >
              <option value="">Все категории</option>
              {filteredCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Дата с</label>
            <input
              type="date"
              className="input"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Дата по</label>
            <input
              type="date"
              className="input"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            className="btn btn-secondary"
            onClick={resetFilters}
          >
            Сбросить фильтры
          </button>
        </div>
      </div>
      
      {loading ? (
        <Loader />
      ) : transactions.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-gray-500">Транзакции не найдены</p>
          {(filterType || filterCategory || filterStartDate || filterEndDate) && (
            <p className="mt-2">
              <button
                className="text-blue-600 hover:underline"
                onClick={resetFilters}
              >
                Сбросить фильтры
              </button>
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Дата</th>
                  <th className="px-4 py-3 text-left">Тип</th>
                  <th className="px-4 py-3 text-left">Категория</th>
                  <th className="px-4 py-3 text-left">Описание</th>
                  <th className="px-4 py-3 text-right">Сумма</th>
                  <th className="px-4 py-3 text-center">Действия</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{formatDate(transaction.date)}</td>
                    <td className="px-4 py-3">
                      {transaction.type === CategoryType.EXPENSE ? 'Расход' : 'Доход'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <span
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: transaction.categoryId.color }}
                        ></span>
                        {transaction.categoryId.name}
                      </div>
                    </td>
                    <td className="px-4 py-3">{transaction.description}</td>
                    <td className={`px-4 py-3 text-right font-bold ${
                      transaction.type === CategoryType.EXPENSE ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.type === CategoryType.EXPENSE ? '-' : '+'}{transaction.amount.toLocaleString('ru-RU')} ₽
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center space-x-2">
                        <Link
                          to={`/transactions/${transaction._id}/edit`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Изменить
                        </Link>
                        <button
                          onClick={() => handleDelete(transaction._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Пагинация */}
          {pages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex space-x-2">
                {[...Array(pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </nav>
            </div>
          )}
          
          <div className="mt-4 text-right text-gray-600">
            Всего: {total} транзакций
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionsPage; 