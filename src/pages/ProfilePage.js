import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    axiosInstance
      .get('/user/profile')
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
      });
  }, []);

  const handleSteamConnect = async () => {
    try {
      const { data } = await axiosInstance.get('/api/steam/connect');
      window.location.href = data.url; // 스팀 로그인 페이지로 리다이렉트
    } catch (error) {
      console.error('Steam connection error:', error);
    }
  };

  return (
    <div>
      <h1>프로필</h1>
      <p>이름: {user.name}</p>
      <p>이메일: {user.email}</p>
      <p>닉네임: {user.nickname}</p>
      <button onClick={handleSteamConnect}>Connect to Steam</button>
    </div>
  );
};

export default ProfilePage;
