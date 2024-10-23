import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { isLoggedInState, userNameState } from '../recoil/atoms'; // Recoil atoms
import { Menu } from 'antd';
import { getUserInfoFromToken } from '../components/parsejwt'; // JWT 파싱 함수
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 아이콘 사용
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import {
  faChartSimple,
  faChartPie,
  faGamepad,
  faTachometerAlt,
  faList,
  faMusic,
} from '@fortawesome/free-solid-svg-icons';
import '../css/CustomHeader.css';

const items = [
  {
    key: '1',
    label: (
      <>
        <FontAwesomeIcon icon={faChartSimple} /> 그래프
      </>
    ),
    link: '/gamegraph',
  },
  {
    key: '2',
    label: (
      <>
        <FontAwesomeIcon icon={faChartPie} /> 차트
      </>
    ),
    link: '/chart',
  },
  {
    key: '3',
    label: (
      <>
        <FontAwesomeIcon icon={faGamepad} /> 게임목록
      </>
    ),
    link: '/gamelist',
  },
  {
    key: '4',
    label: (
      <>
        <FontAwesomeIcon icon={faTachometerAlt} /> 대시보드
      </>
    ),
    link: '/dashboard',
  },
  {
    key: '5',
    label: (
      <>
        <FontAwesomeIcon icon={faList} /> TodoList
      </>
    ),
    link: '/todolist',
  },
  {
    key: '6',
    label: (
      <>
        <FontAwesomeIcon icon={faMusic} /> Piano
      </>
    ),
    link: '/piano',
  },
];

const CustomHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState); // 로그인 상태 관리
  const [userName, setUserName] = useRecoilState(userNameState); // 유저 이름 상태 관리
  const [steamNickname, setSteamNickname] = useState(''); // 스팀 닉네임 상태 관리
  const navigate = useNavigate();

  // 컴포넌트가 처음 마운트될 때 JWT 토큰을 통해 사용자 정보를 가져옴
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const userInfo = getUserInfoFromToken(token);
      if (userInfo) {
        setIsLoggedIn(true);
        setUserName(decodeURIComponent(userInfo.name + '님')); // 유저 이름 설정
        setSteamNickname(localStorage.getItem('steamNickname')); // 스팀 닉네임 설정
      }
    }
  }, [setIsLoggedIn, setUserName]);

  const handleProfile = () => {
    navigate('/profile'); // 프로필 페이지로 이동
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // 토큰 제거
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('steamNickname');
    setIsLoggedIn(false);
    setUserName('');
    setSteamNickname('');
    navigate('/'); // 로그아웃 후 홈 페이지로 이동
  };

  const handleLogoClick = () => {
    navigate('/'); // 로고 클릭 시 홈으로 이동
  };

  return (
    <div
      style={{
        zIndex: 1,
        background: `linear-gradient(90deg, #3A3D40, #2C5364)`, // 어두운 배경 그라데이션
        color: '#FFF',
        textAlign: 'center',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div
        style={{
          fontSize: '1.9em',
          cursor: 'pointer',
          padding: '10px 15px',
          color: '#FFD700',
          fontFamily: 'Roboto, sans-serif',
        }}
        onClick={handleLogoClick}
      >
        <img
          src={require('../images/Home_Icon.png')}
          alt="Home Icon"
          style={{ width: '70px', height: '70px' }}
        />
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['1']}
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'transparent',
          fontFamily: 'Roboto, sans-serif',
        }}
      >
        {items.map((item) => (
          <Menu.Item
            key={item.key}
            onClick={() => navigate(item.link)}
            style={{ color: '#FFF', fontSize: '1.9em', padding: '0 15px' }}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {isLoggedIn ? (
          <>
            <span
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                fontSize: '1.8em',
                color: '#FFF',
              }}
              onClick={handleProfile}
            >
              <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
              {userName || 'Profile'}
            </span>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#FFF',
                cursor: 'pointer',
                padding: '10px 15px',
                fontSize: '1.8em',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FFD700')} // hover 시 색상 변경
              onMouseLeave={(e) => (e.currentTarget.style.color = '#FFF')}
            >
              <FontAwesomeIcon
                icon={faSignOutAlt}
                style={{ marginRight: '8px' }}
              />
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                color: '#FFF',
                marginRight: 20,
                fontSize: '1.1em',
                textDecoration: 'none',
              }}
            >
              로그인
            </Link>
            <Link
              to="/signup"
              style={{
                color: '#FFF',
                marginLeft: 30,
                fontSize: '1.1em',
                textDecoration: 'none',
              }}
            >
              회원가입
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomHeader;
