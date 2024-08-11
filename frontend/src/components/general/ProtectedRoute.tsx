import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import adminAtom from '../../store/adminAtom';
import userAtom from '@/store/userAtom';

type ProtectedRouteProps = {
  children: ReactNode;
  roles:string[]
};

const ProtectedRoute = ({ children , roles }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [admin,setAdmin] = useRecoilState(adminAtom)
  const [user,setUser] = useRecoilState(userAtom)

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
  const getUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');

      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUser((prev) => ({ ...prev, ...response.data.data }));
      } else {
        navigate('/signinuser');
      }
    } catch (error) {
      console.log(error)
      navigate('/signinuser');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if(!admin.id && roles.includes('admin') || roles.includes('superAdmin'))getAdminData();
    else if(!user.id && roles.includes('user')) getUserData()
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!!admin.id || !!user.id) {
    return <div>{children}</div>;
  } else {
    return <div>Unautharized</div>;
  }
};

export default ProtectedRoute;
