import React from 'react';
import axiosInstance from '../api/axiosInstance';
import { Form, Input, Button, message } from 'antd';

const SteamConnectButton = () => {
  const handleSteamConnect = async () => {
    try {
      const response = await axiosInstance.get('/oauth/steam/connect');
      window.location.href = response.data.url; // 스팀 로그인 페이지로 리다이렉트
    } catch (error) {}
  };

  return (
    <Button type="primary" htmlType="submit" onClick={handleSteamConnect}>
      스팀 계정 연동
    </Button>
  );
};

export default SteamConnectButton;
