import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { isLoggedInState, accessTokenState } from '../recoil/atoms';
import axiosInstance from '../api/axiosInstance';

const HandleSteamLoginCallback = () => {
  const navigate = useNavigate();
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const setAccessToken = useSetRecoilState(accessTokenState);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const redirectUrl = params.get('redirectUrl') || '/'; // ���� ���𷺼��� URL

    if (accessToken) {
      // �����κ��� ���� accessToken ����
      localStorage.setItem('accessToken', accessToken);
      setAccessToken(accessToken);
      setIsLoggedIn(true);

      // ���� ���𷺼�
      navigate(redirectUrl);
    } else {
      console.error('Invalid URL: No accessToken present.');
    }
  }, [navigate, setIsLoggedIn, setAccessToken]);

  return <div>Loading...</div>;
};

export default HandleSteamLoginCallback;
