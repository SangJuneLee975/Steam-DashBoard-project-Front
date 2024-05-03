import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, message } from 'antd';
import CustomHeader from './components/CustomHeader';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import axiosInstance from './api/axiosInstance';

const { Header, Content, Footer } = Layout;

function App() {
  useEffect(() => {
    // 파라미터에서 token,code,state을 추출
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const token = params.get('token');

    // 파라미터에 token,state,code가 있으면 로컬 스토리지에 저장하고 URL에서 제거함
    const handleLoginCallback = async () => {
      if (code && state) {
        try {
          const response = await axiosInstance.get(
            `/oauth/naver/callback?code=${code}&state=${state}`
          );
          const { accessToken } = response.data;

          if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
            message.success('로그인 성공');
            window.history.replaceState({}, document.title, '/');
          } else {
            message.error('로그인 실패: 서버로부터 올바른 토큰을 받지 못함');
          }
        } catch (error) {
          message.error('로그인 중 문제가 발생했습니다.');
          console.error('로그인 에러:', error);
        }
      } else if (token) {
        localStorage.setItem('accessToken', token);
        message.success('로그인 성공');
        window.history.replaceState({}, document.title, '/');
      }
    };

    handleLoginCallback();
  }, []);

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <CustomHeader /> {/* CustomHeader 컴포넌트 */}
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: '#fff',
            textAlign: 'center',
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            {/*  */}
          </Routes>
        </Content>
        <Footer
          style={{
            backgroundColor: '#4096ff',
            color: '#fff',
            textAlign: 'center',
          }}
        >
          Footer
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;
