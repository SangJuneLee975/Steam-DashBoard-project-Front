import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { Link } from 'react-router-dom';
import { isLoggedInState } from '../recoil/atoms';

import { getUserInfoFromToken } from '../components/parsejwt';

const CustomHeader = () => {
  const isLoggedIn = useRecoilValue(isLoggedInState);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        const userInfo = getUserInfoFromToken(accessToken);
        console.log(userInfo);
        if (userInfo && userInfo.nickname) {
          setNickname(userInfo.nickname);
        } else {
          console.error('닉네임을 찾을 수 없습니다:', userInfo);
        }
      }
    } else {
      setNickname('');
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
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
