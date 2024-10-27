import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaSteam, FaEdit } from 'react-icons/fa';
import axiosInstance from '../api/axiosInstance';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import '../css/ProfilePage.css';

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
      message.error('스팀 계정 연동 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header-background"></div>

      <div className="profile-card">
        <img
          src="/images/default-avatar.png"
          alt="프로필 아바타"
          className="profile-avatar"
        />
        <h2>{user.name + '님' || '이름'}</h2>
        <p>
          <FaUser /> 닉네임: {user.nickname || '사용자 닉네임'}
        </p>
        <p>
          <FaEnvelope /> 이메일: {user.email || 'user@email.com'}
        </p>

        <div className="profile-buttons">
          <button className="profile-button" onClick={handleEditClick}>
            <FaEdit style={{ marginRight: '8px' }} />
            회원정보 수정
          </button>
          {user.isSteamLinked ? (
            <div className="steam-connected">
              <img
                src="/images/steam_logo_icon.png"
                alt="Steam Logo"
                style={{ width: '20px', marginRight: '8px' }}
              />
              스팀 연동 완료
            </div>
          ) : (
            <button className="profile-button" onClick={handleSteamConnect}>
              <img
                src="/images/steam_logo_icon.png"
                alt="Steam Logo"
                style={{ width: '30px', marginRight: '8px' }}
              />
              스팀 연동
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
