import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, message } from 'antd';
import { Container, Grid, Card, CardContent, Box } from '@mui/material';
import axiosInstance from '../api/axiosInstance';
import { getUserInfoFromToken } from '../components/parsejwt';
import Chart from './Chart'; // 차트 컴포넌트 추가
import CurrentPlayers from './CurrentPlayers';
import PlayerSummary from './PlayerSummary'; // PlayerSummary 컴포넌트 import
import GameGraph from './GameGraph';

const DashboardContainer = (props) => (
  <Container maxWidth="lg" sx={{ paddingTop: '24px', paddingBottom: '24px' }}>
    {props.children}
  </Container>
);

const DashboardCard = ({ children, onClick, sx }) => (
  <Card
    sx={{
      textAlign: 'center',
      color: 'text.secondary',
      padding: 2,
      cursor: onClick ? 'pointer' : 'default',
      ...sx,
    }}
    onClick={onClick}
  >
    <CardContent sx={{ padding: 0 }}>{children}</CardContent>
  </Card>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [ownedGamesCount, setOwnedGamesCount] = useState(0);
  const [recentlyPlayedGamesCount, setRecentlyPlayedGamesCount] = useState(0);
  const [hasSteamId, setHasSteamId] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [steamId, setSteamId] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const checkSteamLink = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const userInfo = getUserInfoFromToken(token);
        if (userInfo && userInfo.steamId) {
          setHasSteamId(true);
          setSteamId(userInfo.steamId);
          fetchDashboardData(userInfo.steamId);
        } else {
          message.warning('스팀 계정을 연동해 주세요.');
          navigate('/profile');
        }
      } catch (error) {
        console.error('Failed to check steam link:', error);
        message.error('오류가 발생했습니다. 다시 시도해주세요.');
        navigate('/login');
      }
    };

    const fetchDashboardData = async (steamId) => {
      try {
        const ownedGamesCountResponse = await axiosInstance.get(
          '/steam/ownedGamesCount',
          { params: { steamId } }
        );
        setOwnedGamesCount(ownedGamesCountResponse.data);

        const recentlyPlayedGamesCountResponse = await axiosInstance.get(
          '/steam/recentlyPlayedGamesCount',
          { params: { steamId } }
        );
        setRecentlyPlayedGamesCount(recentlyPlayedGamesCountResponse.data);

        const userCountResponse = await axiosInstance.get(
          '/steam/getPlayerSummaries',
          { params: { steamId } }
        );

        if (
          userCountResponse.data.response &&
          userCountResponse.data.response.players
        ) {
          setUserCount(userCountResponse.data.response.players.length);
          setProfile(userCountResponse.data.response.players[0]);
        } else {
          setUserCount(0);
        }
      } catch (error) {
        console.error('Error fetching steam data:', error);
        message.error('스팀 데이터를 가져오는 중 오류가 발생했습니다.');
      }
    };

    checkSteamLink();
  }, [navigate]);

  if (!hasSteamId) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardContainer>
      <Typography variant="h4" gutterBottom>
        <div>Steam Dashboard</div>
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard sx={{ padding: 1, width: '350px', height: '140px' }}>
            <Box sx={{ padding: 2 }}>
              <PlayerSummary steamid={steamId} />
              <Typography variant="body1" sx={{ marginBottom: 1 }}></Typography>
            </Box>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard onClick={() => navigate('/chart')}>
            <Typography variant="h6" gutterBottom>
              최근 2주 동안 플레이한 게임 수
            </Typography>
            <Typography variant="h3" color="primary">
              {recentlyPlayedGamesCount}
            </Typography>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardCard onClick={() => navigate('/gamelist')}>
            <Typography variant="h6" gutterBottom>
              가지고 있는 게임 보유수
            </Typography>
            <Typography variant="h3" color="primary">
              {ownedGamesCount}
            </Typography>
          </DashboardCard>
        </Grid>
        <Grid item xs={12}>
          <DashboardCard onClick={() => navigate('/chart')}>
            <Typography variant="h6" gutterBottom></Typography>
            <Chart /> {/* 차트 컴포넌트 추가 */}
          </DashboardCard>
        </Grid>
        <Grid item xs={12}>
          <DashboardCard onClick={() => navigate('/gamegraph')}>
            <Typography variant="h6" gutterBottom></Typography>
            <GameGraph /> {/* 많이 플레이한 게임 차트 추가 */}
          </DashboardCard>
        </Grid>
        <Grid item xs={12}></Grid>
      </Grid>
    </DashboardContainer>
  );
};

export default Dashboard;
