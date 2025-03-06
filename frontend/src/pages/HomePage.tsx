import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const HomePage = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Управляйте своими финансами эффективно
        </h1>
        <p className="text-xl text-gray-600">
          Отслеживайте доходы и расходы, анализируйте свой бюджет и достигайте финансовых целей
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Учет расходов и доходов</h2>
          <p className="text-gray-600 mb-4">
            Легко добавляйте и категоризируйте свои финансовые операции. Отслеживайте, куда уходят ваши деньги.
          </p>
          {userInfo ? (
            <Link to="/transactions" className="btn btn-primary inline-block">
              Мои транзакции
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary inline-block">
              Начать
            </Link>
          )}
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Аналитика и отчеты</h2>
          <p className="text-gray-600 mb-4">
            Визуализируйте свои финансы с помощью наглядных диаграмм и отчетов. Принимайте обоснованные решения.
          </p>
          {userInfo ? (
            <Link to="/dashboard" className="btn btn-primary inline-block">
              Мой дашборд
            </Link>
          ) : (
            <Link to="/register" className="btn btn-primary inline-block">
              Регистрация
            </Link>
          )}
        </div>
      </div>

      <div className="card mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Основные возможности</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Категории</h3>
            <p>Используйте стандартные категории или создавайте свои для лучшей организации финансов</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Диаграммы</h3>
            <p>Наглядные круговые диаграммы для анализа расходов и доходов по категориям</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-bold text-lg mb-2">Статистика</h3>
            <p>Детальная статистика по дням, месяцам и категориям для полного контроля</p>
          </div>
        </div>
      </div>

      {!userInfo && (
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Готовы начать?</h2>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="btn btn-primary">
              Регистрация
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Вход
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage; 