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
    const claimedId = params.get('claimedId');
    const redirectUrl = params.get('redirectUrl');
    const steamNickname = params.get('steamNickname');

    if (accessToken) {
      // JWT 토큰과 스팀 닉네임을  저장
      localStorage.setItem('accessToken', accessToken);
      if (steamNickname) {
        localStorage.setItem('steamNickname', steamNickname);
      }
      // 로그인 상태와 액세스 토큰을 Recoil 상태로 설정
      setIsLoggedIn(true);
      setAccessToken(accessToken);

      // 스팀 ID저장
      if (claimedId) {
        localStorage.setItem('steamId', claimedId);
      }

      // 홈으로 리다이렉트
      navigate(redirectUrl || '/');
    } else {
      console.error('콜백 URL에 토큰이 없습니다');
    }
  }, [navigate, setIsLoggedIn, setAccessToken]);

  return <div>Loading...</div>;
};

export default HandleSteamCallback;
