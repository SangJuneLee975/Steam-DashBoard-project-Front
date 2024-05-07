import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';

const HandleSteamCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const steamId = urlParams.get('steamId'); // ���� �α��� �ݹ鿡�� �����ϴ� ���� ID

    if (steamId) {
      axios
        .post('/oauth/steam/callback', { steamId })
        .then((response) => {})
        .catch((error) => console.error('���� �ݹ� ����:', error));
    }
  }, []);

  return null;
};

export default HandleSteamCallback;
