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
    const openidClaimedId = params.get('openid.claimed_id');
    const accessToken = params.get('accessToken');
    const redirectUrl = params.get('redirectUrl') || '/'; // 최종 리디렉션할 URL

    // OpenID URL에서 Steam ID 추출
    const steamIdMatch = openidClaimedId && openidClaimedId.match(/id\/(\d+)/);
    const steamId = steamIdMatch ? steamIdMatch[1] : null;

    if (steamId) {
      // Steam Web API를 통해 사용자 정보 가져오기
      axiosInstance
        .get(`/oauth/steam/profile/${steamId}`)
        .then((response) => {
          const profile = response.data.response.players[0];
          const steamNickname = profile.personaname;

          console.log('Steam Profile:', profile);

          // 사용자 정보를 로컬 스토리지에 저장
          localStorage.setItem('steamId', steamId);
          localStorage.setItem('steamNickname', steamNickname);

          // 로그인 상태 및 액세스 토큰 설정
          setIsLoggedIn(true);
          setAccessToken(accessToken); // URL에서 받은 accessToken 사용

          // 서버에 연동 요청 보내기
          return axiosInstance.post('/oauth/steam/link', {
            steamId,
            steamNickname,
          });
        })
        .then((response) => {
          console.log('Steam linked successfully:', response.data);
          navigate(redirectUrl);
        })
        .catch((error) => {
          console.error('Failed to link Steam:', error);
        });
    } else {
      console.error('Invalid URL: No Steam ID present.');
    }
  }, [navigate, setIsLoggedIn, setAccessToken]);

  return <div>Loading...</div>;
};

export default HandleSteamCallback;
