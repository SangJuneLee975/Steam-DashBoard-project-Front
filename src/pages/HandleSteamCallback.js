import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { isLoggedInState, accessTokenState } from '../recoil/atoms';

const HandleSteamCallback = () => {
  const navigate = useNavigate();
  const setIsLoggedIn = useSetRecoilState(isLoggedInState);
  const setAccessToken = useSetRecoilState(accessTokenState);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    //const claimedId = params.get('claimedId');
    const redirectUrl = params.get('redirectUrl');
    const steamNickname = params.get('steamNickname');

    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      if (steamNickname) {
        localStorage.setItem('steamNickname', steamNickname);
      }
      setIsLoggedIn(true);
      setAccessToken(accessToken);
      navigate(redirectUrl || '/'); // Ȩ���� �����̷�Ʈ
    } else {
      console.error('�ݹ� URL�� ��ū�� �����ϴ�');
    }
  }, [navigate, setIsLoggedIn, setAccessToken]);

  return <div>Loading...</div>;
};

export default HandleSteamCallback;
