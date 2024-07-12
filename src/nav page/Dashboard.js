import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Typography, List } from 'antd';
import axiosInstance from '../api/axiosInstance';
import { getUserInfoFromToken } from '../components/parsejwt';

const DashBoard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const checkSteamLink = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const userInfo = getUserInfoFromToken(token);
        if (userInfo && userInfo.steamId) {
          fetchSteamData(userInfo.steamId);
        } else {
          message.warning('스팀 계정을 연동해 주세요.');
          navigate('/profile');
        }
      } catch (error) {
        console.error('Failed to check steam link:', error);
        message.error('오류가 발생했습니다. 다시 시도해주세요.');
        navigate('/login');
      }
    };

    const fetchSteamData = async (steamId) => {
      try {
        const profileResponse = await axiosInstance.get(`/steam/profile`, {
          params: { steamId },
        });
        setProfile(profileResponse.data);

        const gamesResponse = await axiosInstance.get(`/steam/ownedGames`, {
          params: { steamId },
        });
        setGames(gamesResponse.data.response.games);
      } catch (error) {
        console.error('Error fetching steam data:', error);
        message.error('스팀 데이터를 가져오는 중 오류가 발생했습니다.');
      }
    };

    checkSteamLink();
  }, [navigate]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Typography.Title level={4}>Steam 프로필</Typography.Title>
      {profile && (
        <div>
          <p>Steam ID: {profile.steamid}</p>
          <p>닉네임: {profile.personaname}</p>
          <p>
            프로필 URL: <a href={profile.profileurl}>{profile.profileurl}</a>
          </p>
        </div>
      )}
      <Typography.Title level={4}>소유한 게임 목록</Typography.Title>
      <List
        itemLayout="horizontal"
        dataSource={games}
        renderItem={(game) => (
          <List.Item>
            <List.Item.Meta
              title={
                <a href={`https://store.steampowered.com/app/${game.appid}`}>
                  {game.name}
                </a>
              }
              description={`게임 ID: ${game.appid}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default DashBoard;
