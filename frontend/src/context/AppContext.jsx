import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = '₹';
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(null)

useEffect(() => {
  const localToken = localStorage.getItem('token')
  setToken(localToken || '')
}, [])

  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // 🆕 added

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message || 'Failed to load doctors');
      }
    } catch (error) {
      console.error('Doctor list error:', error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const loadUserProfileData = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        setUserData(null);
        toast.error(data.message || 'Failed to load profile');
      }
    } catch (error) {
      setUserData(null);
      console.error('Profile fetch error:', error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUserData(null);
    toast.success('Logged out successfully');
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      if (token) {
        await loadUserProfileData();
      }
      setLoading(false);
    };
    init();
  }, [token]);

  const value = {
    currencySymbol,
    backendUrl,
    doctors,
    getDoctorsData,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
    logout,
    loading, // 🆕
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;
