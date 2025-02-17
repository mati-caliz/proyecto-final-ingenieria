import { Route, Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../redux/redux/hooks';

const PrivateRoute = () => {
  const token = useAppSelector((state) => state.user.accessToken);

  return token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
