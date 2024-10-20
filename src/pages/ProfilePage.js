import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { FaUser, FaEnvelope, FaSteam, FaIdBadge } from 'react-icons/fa'; // 아이콘 추가
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
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={user.avatar || '/default-avatar.png'}
            alt="프로필 아바타"
            className="profile-avatar"
          />
          <div className="profile-info">
            <h2>
              <FaUser className="name-icon" />
              {user.name || '사용자 이름'}
            </h2>
            <p>
              <FaIdBadge className="name-icon" />
              {user.nickname || '사용자 닉네임'}
            </p>
          </div>
        </div>

        <div className="profile-icons">
          <div className="profile-icon">
            <FaUser />
            <span>{user.name || '이름: 사용자 이름'}</span>
          </div>
          <div className="profile-icon">
            <FaEnvelope />
            <span>{user.email || '이메일: user@email.com'}</span>
          </div>
        </div>

        <div className="profile-buttons">
          <button className="profile-button" onClick={handleEditClick}>
            <FaUser />
            회원정보 수정
          </button>
          <button className="profile-button" onClick={handleSteamConnect}>
            <FaSteam />
            스팀 연동
          </button>
        </div>
        {user.isSteamLinked && <p>스팀 계정이 연동되었습니다.</p>}
      </div>
    </div>
  );
};

export default ProfilePage;
