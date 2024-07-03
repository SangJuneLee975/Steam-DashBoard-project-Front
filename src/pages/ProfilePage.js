import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState({});
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
      console.error('스팀 계정 연동 에러:', error);
    }
  };

  return (
    <div>
      <h1>프로필</h1>
      <p>이메일: {user.email}</p>
      <p>이름: {user.name}</p>
      <p>닉네임: {user.nickname}</p>
      <Button onClick={handleEditClick}>회원정보 수정</Button>
      <Button onClick={handleSteamConnect}>스팀 계정 연동하기</Button>
      {user.isSteamLinked && <p>스팀 계정이 연동되었습니다.</p>}
    </div>
  );
};

export default ProfilePage;
