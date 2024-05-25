import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { isLoggedInState, accessTokenState } from '../recoil/atoms';
import axiosInstance from '../api/axiosInstance';

const HandleSteamCallback = () => {
  const navigate = useNavigate();
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const setAccessToken = useSetRecoilState(accessTokenState);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const steamId = params.get('claimedId');
    const displayName = params.get('steamNickname');

    const linkSteamAccount = async () => {
      try {
        await axiosInstance.post('/steam/link', {
          steamId,
          displayName,
          accessToken,
        });
        alert('스팀 계정이 연동되었습니다.');
        navigate('/profile');
      } catch (error) {
        console.error('스팀 계정 연동 중 오류 발생:', error);
        alert('스팀 계정 연동 중 오류가 발생했습니다.');
      }
    };

    if (steamId && displayName && accessToken) {
      localStorage.setItem('accessToken', accessToken);
      setIsLoggedIn(true);
      setAccessToken(accessToken);
      linkSteamAccount();
    } else {
      console.error('콜백 URL에 필요한 매개변수가 없습니다.');
    }
  }, [navigate, setIsLoggedIn, setAccessToken]);

  return <div>Loading...</div>;
};

export default HandleSteamCallback;
