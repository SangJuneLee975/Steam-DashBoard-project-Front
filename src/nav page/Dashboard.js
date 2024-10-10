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
import Chart from './Chart';
import CurrentPlayers from './CurrentPlayers';
import PlayerSummary from './PlayerSummary';
import GameGraph from './GameGraph';
import styled, { ThemeProvider } from 'styled-components';

const theme = {
  colors: {
    main: '#1E90FF', // 硫붿씤 �깋�긽 : �뙆����깋
    secondary: '#32CD32', // 蹂댁“ �깋�긽 : 珥덈줉�깋
    gray: '#A9A9A9', // 以묎컙 �쉶�깋
    lightGray: '#f5f5f5', // 諛앹�� �쉶�깋
    textPrimary: '#333', // 吏꾪븳 �쉶�깋
    textSecondary: '#777', // �뿰�븳 �쉶�깋
  },
  spacing: (factor) => `${factor * 8}px`,
};

const Title = styled(Typography)`
  color: ${(props) => props.theme.colors.main};
  font-size: 2em;
  font-weight: bold;
  margin-bottom: ${(props) => props.theme.spacing(3)};
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const DashboardContainer = styled(MuiContainer)`
  padding-top: ${(props) => props.theme.spacing(3)};
  padding-bottom: ${(props) => props.theme.spacing(3)};
  max-width: lg;
  background-color: ${(props) => props.theme.colors.lightGray};
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`;

const DashboardCard = styled(MuiCard)`
  text-align: center;
  color: ${(props) => props.theme.colors.textSecondary};
  padding: ${(props) => props.theme.spacing(2)};
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
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
        }
      } catch (error) {
        setHasSteamId(true);
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
              <Chart />
            </DashboardCard>
          </Grid>
          <Grid item xs={12}>
            <DashboardCard onClick={() => navigate('/gamegraph')}>
              <StyledTypography variant="h6" gutterBottom />
              <GameGraph />
            </DashboardCard>
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
      </DashboardContainer>
    </ThemeProvider>
  );
};

export default Dashboard;
