import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout } from 'antd';
import CustomHeader from './components/CustomHeader';

import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';

const { Header, Content, Footer } = Layout;

function App() {
  useEffect(() => {
    // 파라미터에서 token을 추출
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    // 토큰이 있으면 로컬 스토리지에 저장하고 URL에서 제거함
    if (token) {
      localStorage.setItem('accessToken', token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
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
