import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { updateProfile, clearError } from '../features/auth/authSlice';
import Loader from '../components/ui/Loader';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo, loading, error } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setSuccessMessage('');
    dispatch(clearError());
    
    // Проверка совпадения паролей, если пароль был введен
    if (password && password !== confirmPassword) {
      setPasswordError('Пароли не совпадают');
      return;
    }
    
    const userData = {
      name,
      email,
      ...(password && { password }),
    };
    
    dispatch(updateProfile(userData))
      .unwrap()
      .then(() => {
        setSuccessMessage('Профиль успешно обновлен');
        setPassword('');
        setConfirmPassword('');
      })
      .catch((err) => {
        console.error('Ошибка при обновлении профиля:', err);
      });
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Мой профиль</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {passwordError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {passwordError}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Имя
            </label>
            <input
              type="text"
              id="name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Новый пароль
            </label>
            <input
              type="password"
              id="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
            />
            <p className="text-sm text-gray-500 mt-1">
              Оставьте пустым, если не хотите менять пароль
            </p>
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
              Подтверждение пароля
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              disabled={!password}
            />
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? <Loader /> : 'Обновить профиль'}
          </button>
        </form>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Статистика аккаунта</h2>
        <div className="card">
          <div className="p-4 border-b">
            <p className="text-gray-600">Дата регистрации</p>
            <p className="font-medium">
              {userInfo?.createdAt
                ? new Date(userInfo.createdAt).toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : '-'}
            </p>
          </div>
          <div className="p-4">
            <p className="text-gray-600">ID пользователя</p>
            <p className="font-medium">{userInfo?._id || '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 