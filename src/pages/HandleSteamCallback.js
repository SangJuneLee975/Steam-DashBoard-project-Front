import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';

const HandleSteamCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const steamId = urlParams.get('steamId'); // 스팀 로그인 콜백에서 제공하는 스팀 ID

    if (steamId) {
      axios
        .post('/oauth/steam/callback', { steamId })
        .then((response) => {})
        .catch((error) => console.error('스팀 콜백 에러:', error));
    }
  }, []);

  return null;
};

export default HandleSteamCallback;
