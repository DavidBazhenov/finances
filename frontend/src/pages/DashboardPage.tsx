import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../app/store';
import { fetchTransactionStats } from '../features/transactions/transactionSlice';
import { CategoryType } from '../features/categories/categorySlice';
import Loader from '../components/ui/Loader';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';

// Регистрация компонентов Chart.js
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, loading, error } = useSelector((state: RootState) => state.transactions);
  
  const [dateRange, setDateRange] = useState('month');
  
  useEffect(() => {
    const today = new Date();
    let startDate;
    
    if (dateRange === 'week') {
      // Последняя неделя
      startDate = new Date(today);
      startDate.setDate(today.getDate() - 7);
    } else if (dateRange === 'month') {
      // Последний месяц
      startDate = new Date(today);
      startDate.setMonth(today.getMonth() - 1);
    } else if (dateRange === 'year') {
      // Последний год
      startDate = new Date(today);
      startDate.setFullYear(today.getFullYear() - 1);
    }
    
    dispatch(fetchTransactionStats({
      startDate: startDate?.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0],
    }));
  }, [dispatch, dateRange]);
  
  // Подготовка данных для круговой диаграммы расходов
  const expenseChartData = {
    labels: stats.expenseStats.map(stat => stat.name),
    datasets: [
      {
        data: stats.expenseStats.map(stat => stat.total),
        backgroundColor: stats.expenseStats.map(stat => stat.color),
        borderWidth: 1,
      },
    ],
  };
  
  // Подготовка данных для круговой диаграммы доходов
  const incomeChartData = {
    labels: stats.incomeStats.map(stat => stat.name),
    datasets: [
      {
        data: stats.incomeStats.map(stat => stat.total),
        backgroundColor: stats.incomeStats.map(stat => stat.color),
        borderWidth: 1,
      },
    ],
  };
  
  // Подготовка данных для столбчатой диаграммы по дням
  const getDailyChartData = () => {
    // Группировка данных по дням
    const days = [...new Set(stats.dailyStats.map(stat => stat._id.date))].sort();
    
    // Получение данных расходов и доходов по дням
    const expenseData = days.map(day => {
      const stat = stats.dailyStats.find(
        s => s._id.date === day && s._id.type === CategoryType.EXPENSE
      );
      return stat ? stat.total : 0;
    });
    
    const incomeData = days.map(day => {
      const stat = stats.dailyStats.find(
        s => s._id.date === day && s._id.type === CategoryType.INCOME
      );
      return stat ? stat.total : 0;
    });
    
    return {
      labels: days.map(day => {
        const date = new Date(day);
        return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
      }),
      datasets: [
        {
          label: 'Расходы',
          data: expenseData,
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
        },
        {
          label: 'Доходы',
          data: incomeData,
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
        },
      ],
    };
  };
  
  // Опции для круговых диаграмм
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };
  
  // Опции для столбчатой диаграммы
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Динамика доходов и расходов',
      },
    },
  };
  
  if (loading) return <Loader />;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Финансовый дашборд</h1>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded ${dateRange === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setDateRange('week')}
          >
            Неделя
          </button>
          <button
            className={`px-3 py-1 rounded ${dateRange === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setDateRange('month')}
          >
            Месяц
          </button>
          <button
            className={`px-3 py-1 rounded ${dateRange === 'year' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setDateRange('year')}
          >
            Год
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h2 className="text-xl font-bold mb-2">Баланс</h2>
          <p className={`text-3xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.balance.toLocaleString('ru-RU')} ₽
          </p>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-bold mb-2">Доходы</h2>
          <p className="text-3xl font-bold text-green-600">
            {stats.totalIncome.toLocaleString('ru-RU')} ₽
          </p>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-bold mb-2">Расходы</h2>
          <p className="text-3xl font-bold text-red-600">
            {stats.totalExpense.toLocaleString('ru-RU')} ₽
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Расходы по категориям</h2>
          {stats.expenseStats.length > 0 ? (
            <div className="h-64">
              <Pie data={expenseChartData} options={pieOptions} />
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Нет данных о расходах за выбранный период</p>
          )}
        </div>
        
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Доходы по категориям</h2>
          {stats.incomeStats.length > 0 ? (
            <div className="h-64">
              <Pie data={incomeChartData} options={pieOptions} />
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Нет данных о доходах за выбранный период</p>
          )}
        </div>
      </div>
      
      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4">Динамика по дням</h2>
        {stats.dailyStats.length > 0 ? (
          <div className="h-80">
            <Bar data={getDailyChartData()} options={barOptions} />
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Нет данных за выбранный период</p>
        )}
      </div>
      
      <div className="flex justify-center space-x-4">
        <Link to="/transactions" className="btn btn-primary">
          Все транзакции
        </Link>
        <Link to="/transactions/add" className="btn btn-secondary">
          Добавить транзакцию
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage; 