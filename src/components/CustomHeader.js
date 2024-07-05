import React, { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { isLoggedInState, nicknameState } from '../recoil/atoms';
import { userNameState } from '../recoil/atoms';
import { Layout, Menu } from 'antd';
import { getUserInfoFromToken } from '../components/parsejwt';

const { Header } = Layout;

const items = [
  { key: '1', label: <Link to="/dashboard">nav 1</Link> }, // Dashboard.js로 페이지 이동
  { key: '2', label: <Link to="/">nav 2</Link> },
  { key: '3', label: <Link to="/">nav 3</Link> },
];

const CustomHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const [nickname, setNickname] = useRecoilState(nicknameState); // 닉네임 상태 사용
  const navigate = useNavigate();
  const [userName, setUserName] = useRecoilState(userNameState);
  const [steamNickname, setSteamNickname] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const userInfo = getUserInfoFromToken(token);
      if (userInfo) {
        setIsLoggedIn(true);
        setUserName(decodeURIComponent(userInfo.name + '님')); // 사용자 이름 설정
        setSteamNickname(localStorage.getItem('steamNickname'));
      }
    }
  }, [setIsLoggedIn, setUserName]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // 액세스 토큰 삭제
    localStorage.removeItem('refreshToken'); // 리프레시 토큰 삭제
    localStorage.removeItem('steamNickname'); // 스팀 닉네임 삭제
    setIsLoggedIn(false);
    setUserName('');
    setSteamNickname('');
    navigate('/'); //
  };

  const checkSteamIdInToken = () => {
    const token = localStorage.getItem('accessToken');
    const userInfo = getUserInfoFromToken(token);
    return userInfo && userInfo.steamId;
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
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['1']}
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <Menu.Item key="1">
          {checkSteamIdInToken() ? (
            <Link to="/dashboard">Dashboard</Link>
          ) : (
            <span>Dashboard</span>
          )}
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/">nav 2</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/">nav 3</Link>
        </Menu.Item>
      </Menu>
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
              {steamNickname && <span> (Steam: {steamNickname})</span>}
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
