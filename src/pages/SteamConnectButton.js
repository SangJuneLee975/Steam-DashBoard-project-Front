import React from 'react';
import axiosInstance from '../api/axiosInstance';
import { Form, Input, Button, message } from 'antd';

const SteamConnectButton = () => {
  const handleSteamConnect = async () => {
    try {
      const response = await axiosInstance.get('/oauth/steam/connect');
      window.location.href = response.data.url; // ���� �α��� �������� �����̷�Ʈ
    } catch (error) {
      console.error('Steam connection error:', error);
    }
  };

  return (
    <Button type="primary" htmlType="submit" onClick={handleSteamConnect}>
      ���� ���� ����
    </Button>
  );
};

export default SteamConnectButton;
