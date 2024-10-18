import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography } from 'antd';
import axiosInstance from '../api/axiosInstance';
import { getUserInfoFromToken } from '../components/parsejwt';
import PlayerSummary from './PlayerSummary';
import Chart from './Chart';
import GameGraph from './GameGraph';
import '../css/DashBoard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [ownedGamesCount, setOwnedGamesCount] = useState(0);
  const [recentlyPlayedGamesCount, setRecentlyPlayedGamesCount] = useState(0);
  const [hasSteamId, setHasSteamId] = useState(false);
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
          setProfile(userCountResponse.data.response.players[0]);
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
    <div className="dashboard-container">
      <Typography.Title level={2} className="title">
        Steam Dashboard
      </Typography.Title>

      {/* 상단 3개의 카드 */}
      <div className="grid-container">
        <div className="dashboard-card">
          <PlayerSummary steamid={steamId} />
        </div>

        <div className="dashboard-card" onClick={() => navigate('/chart')}>
          <Typography.Title level={4}>
            최근 2주 동안 플레이한 게임 수
          </Typography.Title>
          <Typography.Title level={3}>
            {recentlyPlayedGamesCount}
          </Typography.Title>
        </div>

        <div className="dashboard-card" onClick={() => navigate('/gamelist')}>
          <Typography.Title level={4}>가지고 있는 게임 보유수</Typography.Title>
          <Typography.Title level={3}>{ownedGamesCount}</Typography.Title>
        </div>
      </div>

      {/* 차트와 그래프를 감싸는 카드 */}
      <div className="chart-graph-container">
        <div className="large-card">
          <Chart width={300} height={240} />
        </div>
        <div className="large-card">
          <GameGraph width={350} height={240} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
