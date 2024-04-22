import React, { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { isLoggedInState, nicknameState } from '../recoil/atoms';

import { getUserInfoFromToken } from '../components/parsejwt';

const CustomHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const [nickname, setNickname] = useRecoilState(nicknameState); // 닉네임 상태 사용
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const userInfo = getUserInfoFromToken(token);
      if (userInfo) {
        setIsLoggedIn(true);
        setNickname(userInfo.nickname); // 닉네임 설정
      }
    }
  }, [setIsLoggedIn, setNickname]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // 액세스 토큰 삭제
    localStorage.removeItem('refreshToken'); // 리프레시 토큰 삭제
    setIsLoggedIn(false);
    setNickname('');
    navigate('/'); //
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
            <span>{nickname}</span>
            <button onClick={handleLogout}>로그아웃</button>
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
