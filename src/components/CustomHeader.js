import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { isLoggedInState } from '../recoil/atoms';
import { userNameState } from '../recoil/atoms';
import { Menu, message } from 'antd';
import { getUserInfoFromToken } from '../components/parsejwt';

const items = [
  { key: '1', label: '그래프', link: '/gamegraph' },
  { key: '2', label: '차트', link: '/chart' },
  { key: '3', label: '게임목록', link: '/gamelist' },
  { key: '4', label: '대시보드', link: '/dashboard' },
  { key: '5', label: 'TodoList', link: '/todolist' },
  { key: '6', label: 'Piano', link: '/piano' },
];

const CustomHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
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

  const handleProfile = () => {
    navigate('/profile');
  };

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

  const handleMenuClick = (link) => {
    // 그래프, 차트, 게임목록, 대시보드 메뉴일 경우 스팀 계정 연동 확인하지 않음
    if (
      link === '/todolist' ||
      link === '/piano' ||
      link === '/gamegraph' ||
      link === '/chart' ||
      link === '/gamelist' ||
      link === '/dashboard'
    ) {
      navigate(link);
    } else {
      if (checkSteamIdInToken()) {
        navigate(link);
      } else {
        navigate('/profile'); // 스팀 계정 비연동 유저는 프로필페이지로 이동
        message.warning('스팀 계정을 연동해 주세요.');
      }
    }
  };

  // const handleMenuClick = (link) => {
  //   // TodoList 메뉴일 경우에는 스팀 계정 연동 확인하지 않음
  //   if (link === '/todolist' || link === '/piano') {
  //     navigate(link);
  //   } else {
  //     if (checkSteamIdInToken()) {
  //       navigate(link);
  //     } else {
  //       navigate('/profile'); // 스팀 계정 비연동 유저는 프로필페이지로 이동
  //       message.warning('스팀 계정을 연동해 주세요.');
  //     }
  //   }
  // };

  const handleLogoClick = () => {
    navigate('/'); // Home 페이지로 이동
  };

  return (
    <div
      style={{
        background: `linear-gradient(90deg, #00c6ff, #0072ff)`, //'#4096ff' HOME버튼 색깔
        color: '#fff',
        textAlign: 'center',
        padding: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div
        style={{ fontSize: '1.5em', cursor: 'pointer' }}
        onClick={handleLogoClick}
      >
        HOME
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['1']}
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        {items.map((item) => (
          <Menu.Item key={item.key} onClick={() => handleMenuClick(item.link)}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
      <div>
        {isLoggedIn ? (
          <>
            <div>
              <span
                style={{ marginRight: '10px', cursor: 'pointer' }}
                onClick={handleProfile}
              >
                {userName || 'Profile'}
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
