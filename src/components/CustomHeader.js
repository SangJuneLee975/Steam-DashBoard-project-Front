import React, { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { isLoggedInState, nicknameState } from '../recoil/atoms';
import { userNameState } from '../recoil/atoms';
import { getUserInfoFromToken } from '../components/parsejwt';

const CustomHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const [nickname, setNickname] = useRecoilState(nicknameState); // 닉네임 상태 사용
  const navigate = useNavigate();
  const [userName, setUserName] = useRecoilState(userNameState);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const userInfo = getUserInfoFromToken(token);
      if (userInfo) {
        setIsLoggedIn(true);
        setUserName(userInfo.name); // 사용자 이름 설정
      }
    }
  }, [setIsLoggedIn, setUserName]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // 액세스 토큰 삭제
    localStorage.removeItem('refreshToken'); // 리프레시 토큰 삭제
    setIsLoggedIn(false);
    setUserName('');
    navigate('/'); //
  };

  const handleProfile = () => {
    navigate('/profile'); // 프로필 페이지로 이동
  };

  return (
    <div
      style={{
        backgroundColor: '#4096ff',
        color: '#fff',
        textAlign: 'center',
        padding: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ fontSize: '1.5em' }}>Logo</div>
      <div>
        {isLoggedIn ? (
          <>
            <div>
              <span
                style={{ marginRight: '10px', cursor: 'pointer' }}
                onClick={() => navigate('/profile')}
              >
                {userName || 'Profile'} {/* 사용자 이름 표시 */}
              </span>
              <button onClick={handleLogout}>로그아웃</button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff', marginRight: 20 }}>
              로그인
            </Link>
            <Link to="/signup" style={{ color: '#fff' }}>
              회원가입
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomHeader;
