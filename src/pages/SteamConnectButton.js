import React from 'react';
import axiosInstance from '../api/axiosInstance';
import { Button, message } from 'antd';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '../recoil/atoms';

const SteamConnectButton = () => {
  const accessToken = useRecoilValue(accessTokenState);
  console.log('AccessToken:', accessToken);

  const handleSteamConnect = async () => {
    if (!accessToken) {
      message.error('로그인이 필요합니다.');
      return;
    }

    try {
      // axiosInstance를 사용하여 API 호출
      const response = await axiosInstance.get('/oauth/steam/connect', {
        headers: {
          Authorization: `Bearer ${accessToken}`, // 헤더에 accessToken 전달
        },
      });

      window.location.href = response.data.url.replace('Bearer ', ''); // Bearer 문자열 제거, Steam 로그인 페이지로 리다이렉트
    } catch (error) {
      message.error('Steam 계정 연동에 실패했습니다.');
      console.error('Steam 계정 연동 에러:', error);
    }
  };
  return (
    <Button type="primary" onClick={handleSteamConnect}>
      Steam 계정 연동
    </Button>
  );
};

export default SteamConnectButton;
