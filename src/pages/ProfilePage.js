import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const [steamProfile, setSteamProfile] = useState(null);
  const [ownedGames, setOwnedGames] = useState([]);
  const [recentlyPlayedGames, setRecentlyPlayedGames] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/user/profile');
        setUser(response.data);

        const steamProfileResponse = await axiosInstance.get('/steam/profile');
        setSteamProfile(steamProfileResponse.data);

        const ownedGamesResponse = await axiosInstance.get('/steam/ownedGames');
        setOwnedGames(ownedGamesResponse.data.response.games);

        const recentlyPlayedGamesResponse = await axiosInstance.get(
          '/steam/recentlyPlayedGames'
        );
        setRecentlyPlayedGames(recentlyPlayedGamesResponse.data.response.games);
      } catch (error) {
        console.error('프로필을 가져오는 중에 오류가 발생:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    navigate('/profileupdate');
  };

  const handleSteamConnect = async () => {
    try {
      const { data } = await axiosInstance.get('/oauth/steam/connect');
      window.location.href = data.url; // 스팀 로그인 페이지로 리다이렉트
    } catch (error) {
      console.error('스팀계정 연동 에러:', error);
    }
  };

  return (
    <div>
      <h1>프로필</h1>
      <p>이메일: {user.email}</p>
      <p>이름: {user.name}</p>

      <p>닉네임: {user.nickname}</p>
      <Button onClick={handleEditClick}>회원정보 수정</Button>

      <Button onClick={handleSteamConnect}>스팀계정 연동하기</Button>

      {steamProfile && (
        <div>
          <h2>Steam Profile</h2>
          <img src={steamProfile.avatarfull} alt="Avatar" />
          <p>Steam ID: {steamProfile.steamid}</p>
          <p>Nickname: {steamProfile.personaname}</p>
          <p>
            Profile URL:{' '}
            <a
              href={steamProfile.profileurl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {steamProfile.profileurl}
            </a>
          </p>
        </div>
      )}

      {ownedGames.length > 0 && (
        <div>
          <h2>Owned Games</h2>
          <ul>
            {ownedGames.map((game) => (
              <li key={game.appid}>{game.name}</li>
            ))}
          </ul>
        </div>
      )}

      {recentlyPlayedGames.length > 0 && (
        <div>
          <h2>Recently Played Games</h2>
          <ul>
            {recentlyPlayedGames.map((game) => (
              <li key={game.appid}>{game.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
