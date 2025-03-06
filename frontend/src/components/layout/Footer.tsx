const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">FinanceTracker</h3>
            <p className="text-gray-400 mt-1">Управляйте своими финансами эффективно</p>
          </div>
          
          <div className="text-center md:text-right">
            <p>&copy; {currentYear} FinanceTracker. Все права защищены.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 