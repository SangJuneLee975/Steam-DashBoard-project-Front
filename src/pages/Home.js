import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import axios from 'axios';
import { isLoggedInState } from '../recoil/atoms';
import Features from '../components/Features';
import { Button } from 'antd';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      setIsLoggedIn(true);
    }
  }, [setIsLoggedIn]);

  return (
    <div>
      <h1>홈 화면</h1>
      {isLoggedIn ? (
        <div>
          <p></p>
        </div>
      ) : (
        <div>
          <Link to="/login">로그인</Link>
          <Link to="/signup">회원가입</Link>
        </div>
      )}
      <Features /> {/* Product Features 컴포넌트를 추가 */}
    </div>
  );
};

export default Home;
