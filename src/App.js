import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, message } from 'antd';
import CustomHeader from './components/CustomHeader';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import ProfileUpdate from './pages/ProfileUpdate';
import HandleSteamCallback from './pages/HandleSteamCallback';
import SteamLoginButton from './pages/SteamLoginButton';
import GameGraph from './nav page/GameGraph';
import Chart from './nav page/Chart';
import GameList from './nav page/GameList';
import axiosInstance from './api/axiosInstance';
import WordCloud from './nav page/WordCloud';
import Dashboard from './nav page/DashBoard';
import LandingPage from './pages/LandingPage';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import styled from 'styled-components';
import HandleSteamLoginCallback from './pages/HandleSteamLoginCallback';
import HandleSteamLinkCallback from './pages/HandleSteamLinkCallback';
import SteamConnectButton from './pages/SteamConnectButton';
import TodoListPage from './pages/TodoListPage';
import Piano from './pages/Piano';

const { Content } = Layout;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const token = params.get('token');
    const accessToken = params.get('accessToken');
    const claimedId = params.get('claimedId');
    const redirectUrl = params.get('redirectUrl') || '/';

    const handleLoginCallback = async () => {
      if (code && state) {
        try {
          const response = await axiosInstance.get(
            `/oauth/naver/callback?code=${code}&state=${state}`
          );
          const { accessToken } = response.data;

          if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
            message.success('Login successful');
            window.history.replaceState({}, document.title, '/');
            window.location.href = '/';
          } else {
            message.error('Login failed: Invalid token from server');
          }
        } catch (error) {
          message.error('Error during login');
          console.error('Login error:', error);
        }
      } else if (token) {
        localStorage.setItem('accessToken', token);
        message.success('Login successful');
        window.history.replaceState({}, document.title, '/');
        window.location.href = '/';
      } else if (accessToken && claimedId) {
        const steamId = claimedId.split('/').pop();

        try {
          const response = await axiosInstance.get(
            `/oauth/steam/profile/${steamId}`
          );
          const profile = response.data.response.players[0];
          const steamNickname = profile.personaname;

          console.log('Steam Profile:', profile);

          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('steamNickname', steamNickname);

          message.success('Steam linked successfully');
          window.history.replaceState({}, document.title, '/');
          window.location.href = redirectUrl;

          await axiosInstance.post('/oauth/steam/link', {
            accessToken,
            steamId,
          });
        } catch (error) {
          message.error('Failed to link Steam');
          console.error('Failed to link Steam:', error);
        }
      }
    };

    handleLoginCallback();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <CustomHeader />
          <Content
            style={{
              // ???? ??,?? ???
              margin: '24px 16px',
              padding: 0,
              background: '#fff',
              textAlign: 'center',
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profileupdate" element={<ProfileUpdate />} />
              <Route path="/SteamLoginButton" element={<SteamLoginButton />} />
              <Route path="/steam-connect" element={<SteamConnectButton />} />
              <Route
                path="/oauth/steam/callback"
                element={<HandleSteamCallback />}
              />
              <Route path="/gamegraph" element={<GameGraph />} />
              <Route path="/chart" element={<Chart />} />
              <Route path="/gamelist" element={<GameList />} />
              <Route path="/wordcloud" element={<WordCloud />} />
              <Route path="/wordcloud/:appid" element={<WordCloud />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/landing" element={<LandingPage />} />
              <Route
                path="/oauth/steam/login/callback"
                element={<HandleSteamLoginCallback />}
              />
              <Route
                path="/oauth/steam/link/callback"
                element={<HandleSteamLinkCallback />}
              />
              <Route path="/todolist" element={<TodoListPage />} />
              <Route path="/piano" element={<Piano />} />
            </Routes>
          </Content>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
