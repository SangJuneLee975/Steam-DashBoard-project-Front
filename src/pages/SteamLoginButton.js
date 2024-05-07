import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance'; // 설정된 axios 인스턴스 가져오기

const SteamLoginButton = () => {
  const navigate = useNavigate();

  const handleSteamLogin = async () => {
    try {
      const response = await axios.get('/oauth/steam/login');
      window.location.href = response.data.steamLoginUrl; // 스팀 로그인 페이지로 리다이렉트
    } catch (error) {
      console.error('Steam login error:', error);
    }
  };

  return <button onClick={handleSteamLogin}>Steam으로 로그인</button>;
};

export default SteamLoginButton;
