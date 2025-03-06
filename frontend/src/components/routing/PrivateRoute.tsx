import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  return userInfo ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute; 