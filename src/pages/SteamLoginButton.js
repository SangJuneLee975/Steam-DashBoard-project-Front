import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance'; // ������ axios �ν��Ͻ� ��������

const SteamLoginButton = () => {
  const navigate = useNavigate();

  const handleSteamLogin = async () => {
    try {
      const response = await axios.get('/oauth/steam/login');
      window.location.href = response.data.steamLoginUrl; // ���� �α��� �������� �����̷�Ʈ
    } catch (error) {
      console.error('Steam login error:', error);
    }
  };

  return <button onClick={handleSteamLogin}>Steam���� �α���</button>;
};

export default SteamLoginButton;
