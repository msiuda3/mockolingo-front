import React, { useEffect, useState } from 'react';
import Login from './login/login';
import useToken from './login/useToken';
import CoursesList from './CoursesList';
import AdminView from './AdminView';

const Dashboard = () => {
  const { token, setToken } = useToken();
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const fetchUserType = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/auth/role', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          setUserType(data.role);
        } catch (error) {
          console.error('Error fetching user type:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserType();
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
  };

  if (!token) {
    return <Login setToken={setToken} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={handleLogout}>Wyloguj się</button>
      {userType === 'ADMIN' ? <AdminView /> : <CoursesList />}
    </div>
  );
};

export default Dashboard;
