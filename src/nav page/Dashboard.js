import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, message } from 'antd';
import {
  Container as MuiContainer,
  Grid,
  Card as MuiCard,
  CardContent,
  Box,
} from '@mui/material';
import axiosInstance from '../api/axiosInstance';
import { getUserInfoFromToken } from '../components/parsejwt';
import Chart from './Chart'; // 차트 컴포넌트 추가
import CurrentPlayers from './CurrentPlayers';
import PlayerSummary from './PlayerSummary'; // PlayerSummary 컴포넌트 import
import GameGraph from './GameGraph';
import styled, { ThemeProvider } from 'styled-components';

const theme = {
  colors: {
    main: '#1E90FF', // 파란색
    secondary: '#32CD32', // 초록색
    gray: '#A9A9A9', // 회색
    textPrimary: '#333', // 기본 텍스트 색상
    textSecondary: '#777', // 부가 텍스트 색상
  },
  spacing: (factor) => `${factor * 8}px`,
};

const Title = styled(Typography)`
  color: ${(props) => props.theme.colors.main};
  font-size: 1.5em;
  margin-bottom: ${(props) => props.theme.spacing(2)};
`;

const DashboardContainer = styled(MuiContainer)`
  padding-top: ${(props) => props.theme.spacing(3)};
  padding-bottom: ${(props) => props.theme.spacing(3)};
  max-width: lg;
`;

const DashboardCard = styled(MuiCard)`
  text-align: center;
  color: ${(props) => props.theme.colors.textSecondary};
  padding: ${(props) => props.theme.spacing(2)};
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }
`;

const CustomBox = styled(Box)`
  padding: ${(props) => props.theme.spacing(2)};
  background-color: white;
  border-radius: 8px;
`;

const StyledTypography = styled(Typography)`
  color: ${(props) =>
    props.primary ? props.theme.colors.main : props.theme.colors.textPrimary};
  font-weight: ${(props) => (props.bold ? 'bold' : 'normal')};
`;

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
    <ThemeProvider theme={theme}>
      <DashboardContainer>
        <Title variant="h4" gutterBottom>
          Steam Dashboard
        </Title>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard sx={{ padding: 1, width: '350px', height: '140px' }}>
              <CustomBox>
                <PlayerSummary steamid={steamId} />
                <StyledTypography variant="body1" sx={{ marginBottom: 1 }} />
              </CustomBox>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard onClick={() => navigate('/chart')}>
              <StyledTypography variant="h6" gutterBottom>
                최근 2주 동안 플레이한 게임 수
              </StyledTypography>
              <StyledTypography variant="h3" color="primary" bold>
                {recentlyPlayedGamesCount}
              </StyledTypography>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardCard onClick={() => navigate('/gamelist')}>
              <StyledTypography variant="h6" gutterBottom>
                가지고 있는 게임 보유수
              </StyledTypography>
              <StyledTypography variant="h3" color="primary" bold>
                {ownedGamesCount}
              </StyledTypography>
            </DashboardCard>
          </Grid>
          <Grid item xs={12}>
            <DashboardCard onClick={() => navigate('/chart')}>
              <StyledTypography variant="h6" gutterBottom />
              <Chart /> {/* 차트 컴포넌트 추가 */}
            </DashboardCard>
          </Grid>
          <Grid item xs={12}>
            <DashboardCard onClick={() => navigate('/gamegraph')}>
              <StyledTypography variant="h6" gutterBottom />
              <GameGraph /> {/* 많이 플레이한 게임 차트 추가 */}
            </DashboardCard>
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
      </DashboardContainer>
    </ThemeProvider>
  );
};

export default Dashboard;
