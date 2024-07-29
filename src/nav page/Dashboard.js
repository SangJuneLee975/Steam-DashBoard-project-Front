import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, message, Row, Col, Card, Statistic } from 'antd';
import axiosInstance from '../api/axiosInstance';
import { getUserInfoFromToken } from '../components/parsejwt';
import CurrentPlayers from './CurrentPlayers';
import RecentlyPlayedGames from './RecentlyPlayedGames';
import GameNews from './GameNews';
import PlayerSummary from './PlayerSummary';
import Chart from './Chart'; // 차트 컴포넌트 추가

const Dashboard = () => {
  const navigate = useNavigate();
  const [ownedGamesCount, setOwnedGamesCount] = useState(0);
  const [recentlyPlayedGamesCount, setRecentlyPlayedGamesCount] = useState(0);
  const [hasSteamId, setHasSteamId] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [steamId, setSteamId] = useState(null);

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
    <div className="dashboard">
      <Typography.Title level={4}>Steam Dashboard</Typography.Title>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card>
            <PlayerSummary steamid={steamId} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="최근 2주 동안 플레이한 게임 수"
              value={recentlyPlayedGamesCount}
            />
          </Card>
          <Row gutter={[25, 25]}>
            <Col span={25}>
              <Card>
                <Chart /> {/* */}
              </Card>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="가지고 있는 게임 보유수"
              value={ownedGamesCount}
            />
          </Card>
          <Col span={36}>
            <Card>
              <CurrentPlayers appid="1172470" />{' '}
              {/* 현재 플레이어 수 컴포넌트 추가 */}
            </Card>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
