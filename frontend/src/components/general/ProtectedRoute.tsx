import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import adminAtom from '../../store/adminAtom';

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [admin,setAdmin] = useRecoilState(adminAtom)

  const getAdminData = async () => {
    try {
      const token = localStorage.getItem('authToken');

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setAdmin((prev) => ({ ...prev, ...response.data.data }));
      } else {
        navigate('/signin');
      }
    } catch (error) {
      console.log(error)
      navigate('/signin');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAdminData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!!admin.id) {
    return <div>{children}</div>;
  } else {
    return <Navigate to='/signin' />;
  }
};

export default ProtectedRoute;
