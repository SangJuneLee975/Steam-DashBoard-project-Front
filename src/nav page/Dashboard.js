import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import axiosInstance from '../api/axiosInstance';
import { getUserInfoFromToken } from '../components/parsejwt';

const Dashboard = () => {
  const navigate = useNavigate();
  const [hasSteamId, setHasSteamId] = useState(false);

  useEffect(() => {
    const checkSteamLink = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const userInfo = getUserInfoFromToken(token);
        if (userInfo && userInfo.steamId) {
          setHasSteamId(true);
        } else {
          message.warning('스팀 계정을 연동해 주세요.');
          navigate('/profile'); // 스팀 계정이 연동되지 않은 경우 프로필 페이지로 이동
        }
      } catch (error) {
        console.error('Failed to check steam link:', error);
        message.error('오류가 발생했습니다. 다시 시도해주세요.');
        navigate('/login'); // 오류 발생 시 로그인 페이지로 이동
      }
    };

    checkSteamLink();
  }, [navigate]);

  if (!hasSteamId) {
    return <div>Loading...</div>;
  }

  return <div>Dashboard</div>; // 스팀 계정이 연동된 경우 대시보드 표시
};

export default Dashboard;
