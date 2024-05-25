import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [steamProfile, setSteamProfile] = useState(null);
  const [ownedGames, setOwnedGames] = useState([]);
  const [recentlyPlayedGames, setRecentlyPlayedGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/user/profile');
        setUser(response.data);
      } catch (error) {
        console.error('프로필을 가져오는 중에 오류가 발생:', error);
      }
    };

    const fetchOwnedGames = async () => {
      try {
        const response = await axiosInstance.get('/steam/ownedGames');
        setOwnedGames(response.data.response.games);
      } catch (error) {
        console.error('소유한 게임 정보를 가져오는 중에 오류가 발생:', error);
      }
    };

    fetchProfile();
    fetchOwnedGames();
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
      <p>스팀 연동 여부: {user.isSteamLinked ? '연동됨' : '연동되지 않음'}</p>
      <Button onClick={handleEditClick}>회원정보 수정</Button>
      <Button onClick={handleSteamConnect}>스팀계정 연동하기</Button>
      {steamProfile && (
        <div>
          <h2>Steam 프로필</h2>
          <img src={steamProfile.avatarfull} alt="Avatar" />
          <p>닉네임: {steamProfile.personaname}</p>
        </div>
      )}
      <div>
        <h3>소유한 게임</h3>
        <ul>
          {ownedGames.map((game) => (
            <li key={game.appid}>
              {game.name} - 플레이 시간: {game.playtime_forever}분
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;
