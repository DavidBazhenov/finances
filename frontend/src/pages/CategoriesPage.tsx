import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { 
  fetchCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  CategoryType
} from '../features/categories/categorySlice';
import Loader from '../components/ui/Loader';

const CategoriesPage = () => {
  const [activeTab, setActiveTab] = useState<CategoryType>(CategoryType.EXPENSE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  
  // Форма
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('tag');
  const [color, setColor] = useState('#6366F1');
  
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector((state: RootState) => state.categories);
  
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  
  const filteredCategories = categories.filter(
    (category) => category.type === activeTab
  );
  
  const handleOpenModal = (category?: any) => {
    if (category) {
      setEditingCategory(category._id);
      setName(category.name);
      setIcon(category.icon);
      setColor(category.color);
    } else {
      setEditingCategory(null);
      setName('');
      setIcon('tag');
      setColor('#6366F1');
    }
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setName('');
    setIcon('tag');
    setColor('#6366F1');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryData = {
      name,
      type: activeTab,
      icon,
      color,
    };
    
    if (editingCategory) {
      dispatch(updateCategory({ id: editingCategory, categoryData }))
        .unwrap()
        .then(() => {
          handleCloseModal();
        })
        .catch((err) => {
          console.error('Ошибка при обновлении категории:', err);
        });
    } else {
      dispatch(createCategory(categoryData))
        .unwrap()
        .then(() => {
          handleCloseModal();
        })
        .catch((err) => {
          console.error('Ошибка при создании категории:', err);
        });
    }
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      dispatch(deleteCategory(id));
    }
  };
  
  // Список доступных иконок
  const availableIcons = [
    'tag', 'home', 'shopping-cart', 'utensils', 'car', 'plane',
    'bus', 'subway', 'truck', 'ship', 'bicycle', 'walking',
    'coffee', 'glass-martini', 'beer', 'wine-glass', 'cocktail',
    'pizza-slice', 'hamburger', 'ice-cream', 'cookie', 'candy-cane',
    'carrot', 'apple-alt', 'lemon', 'pepper-hot', 'egg',
    'bread-slice', 'cheese', 'drumstick-bite', 'fish', 'bacon',
    'bone', 'seedling', 'tree', 'leaf', 'spa', 'shower',
    'bath', 'toilet', 'tooth', 'prescription-bottle', 'pills',
    'first-aid', 'syringe', 'stethoscope', 'heartbeat', 'medkit',
    'hospital', 'ambulance', 'thermometer', 'procedures', 'diagnoses',
    'dna', 'brain', 'book', 'graduation-cap', 'university',
    'school', 'chalkboard-teacher', 'user-graduate', 'laptop-code',
    'code', 'laptop', 'desktop', 'mobile-alt', 'tablet-alt',
    'gamepad', 'headphones', 'music', 'film', 'video',
    'camera', 'photo-video', 'image', 'palette', 'paint-brush',
    'pencil-alt', 'pen', 'marker', 'highlighter', 'brush',
    'fill', 'stamp', 'compass', 'drafting-compass', 'ruler',
    'ruler-combined', 'ruler-horizontal', 'ruler-vertical', 'scissors',
    'cut', 'copy', 'paste', 'save', 'file',
    'file-alt', 'file-pdf', 'file-word', 'file-excel', 'file-powerpoint',
    'file-image', 'file-audio', 'file-video', 'file-archive', 'file-code',
    'folder', 'folder-open', 'archive', 'box', 'boxes',
    'dolly', 'dolly-flatbed', 'pallet', 'shipping-fast', 'truck-loading',
    'truck-moving', 'people-carry', 'route', 'map-marked', 'map-marked-alt',
    'map-signs', 'compass', 'map', 'globe', 'globe-americas',
    'globe-asia', 'globe-europe', 'globe-africa', 'earth-americas', 'earth-asia',
    'earth-europe', 'earth-africa', 'flag', 'flag-checkered', 'flag-usa',
    'passport', 'id-card', 'id-card-alt', 'address-card', 'address-book',
    'contact-card', 'phone', 'phone-alt', 'mobile', 'mobile-alt',
    'tablet', 'tablet-alt', 'laptop', 'desktop', 'tv',
    'print', 'fax', 'calculator', 'cash-register', 'receipt',
    'money-bill', 'money-bill-alt', 'money-bill-wave', 'money-bill-wave-alt', 'money-check',
    'money-check-alt', 'credit-card', 'cc-visa', 'cc-mastercard', 'cc-amex',
    'cc-discover', 'cc-paypal', 'cc-stripe', 'cc-apple-pay', 'cc-amazon-pay',
    'wallet', 'coins', 'donate', 'hand-holding-usd', 'hand-holding-heart',
    'hand-holding-medical', 'hands-helping', 'handshake', 'heart', 'heartbeat',
    'heart-broken', 'gift', 'gifts', 'birthday-cake', 'baby',
    'baby-carriage', 'child', 'female', 'male', 'user',
    'user-alt', 'user-circle', 'user-friends', 'user-group', 'users',
    'user-tie', 'user-md', 'user-nurse', 'stethoscope', 'user-injured',
    'procedures', 'wheelchair', 'bed', 'procedures', 'diagnoses',
    'disease', 'virus', 'virus-slash', 'viruses', 'bacteria',
    'bacterium', 'biohazard', 'radiation', 'radiation-alt'
  ];
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Категории</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Табы */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === CategoryType.EXPENSE
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab(CategoryType.EXPENSE)}
        >
          Расходы
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === CategoryType.INCOME
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab(CategoryType.INCOME)}
        >
          Доходы
        </button>
      </div>
      
      {/* Кнопка добавления */}
      <div className="mb-6">
        <button
          className="btn btn-primary"
          onClick={() => handleOpenModal()}
        >
          Добавить категорию
        </button>
      </div>
      
      {/* Список категорий */}
      {loading ? (
        <Loader />
      ) : filteredCategories.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-gray-500">Категории не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <div
              key={category._id}
              className="card p-4 flex items-center justify-between"
            >
              <div className="flex items-center">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white mr-3"
                  style={{ backgroundColor: category.color }}
                >
                  <i className={`fas fa-${category.icon}`}></i>
                </span>
                <span className="font-medium">{category.name}</span>
              </div>
              
              <div className="flex space-x-2">
                {!category.isDefault && (
                  <>
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleOpenModal(category)}
                    >
                      Изменить
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(category._id)}
                    >
                      Удалить
                    </button>
                  </>
                )}
                {category.isDefault && (
                  <span className="text-gray-500 text-sm">Стандартная</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Модальное окно */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? 'Редактировать категорию' : 'Добавить категорию'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Название
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
                <label htmlFor="icon" className="block text-gray-700 font-medium mb-2">
                  Иконка
                </label>
                <div className="grid grid-cols-8 gap-2 mb-2 max-h-40 overflow-y-auto">
                  {availableIcons.map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        icon === iconName
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      onClick={() => setIcon(iconName)}
                    >
                      <i className={`fas fa-${iconName} text-sm`}></i>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="color" className="block text-gray-700 font-medium mb-2">
                  Цвет
                </label>
                <input
                  type="color"
                  id="color"
                  className="w-full h-10 rounded-md cursor-pointer"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? <Loader /> : editingCategory ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage; 