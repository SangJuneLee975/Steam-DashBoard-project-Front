import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { isLoggedInState, accessTokenState } from '../recoil/atoms';
import axiosInstance from '../api/axiosInstance';

const HandleSteamLinkCallback = () => {
  const navigate = useNavigate();
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const setAccessToken = useSetRecoilState(accessTokenState);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const steamId = params.get('steamId');
    const redirectUrl = params.get('redirectUrl') || '/';

    if (accessToken && steamId) {
      // �α��� ���� �� �׼��� ��ū ����
      setIsLoggedIn(true);
      setAccessToken(accessToken); // URL���� ���� accessToken ���

      // ����� ������ ���� ���丮���� ����
      localStorage.setItem('steamId', steamId);

      // ������ ���� ��û ������
      //   .post(`${process.env.REACT_APP_API_URL}/oauth/steam/link/callback`, {
      axiosInstance
        .post(`${process.env.REACT_APP_API_URL}/oauth/steam/link/callback`, {
          accessToken,
          steamId,
        })
        .then((response) => {
          console.log('Steam linked successfully:', response.data);
          navigate(redirectUrl);
        })
        .catch((error) => {
          console.error('Failed to link Steam:', error);
        });
    } else {
      console.error('Invalid URL: Missing parameters.');
    }
  }, [navigate, setIsLoggedIn, setAccessToken]);

  return <div>Loading...</div>;
};

export default HandleSteamLinkCallback;
