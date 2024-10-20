import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Typography } from 'antd';
import axiosInstance from '../api/axiosInstance';
import { getUserInfoFromToken } from '../components/parsejwt';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { Box } from '@mui/material';
import CustomAxis from './CustomAxis';
import styled from 'styled-components';
import { Container as MuiContainer } from '@mui/material';

const ChartContainer = styled(MuiContainer)`
  padding-top: ${(props) => props.theme.spacing(3)};
  padding-bottom: ${(props) => props.theme.spacing(3)};
  max-width: lg;
  background-color: ${(props) => props.theme.colors.lightGray};
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`;

const GameGraph = () => {
  const navigate = useNavigate();
  const [hasSteamId, setHasSteamId] = useState(false);
  const [games, setGames] = useState([]);

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
          fetchGames(userInfo.steamId);
        } else {
          setHasSteamId(true);
          //    message.warning('스팀 계정을 연동해 주세요.');
          //   navigate('/profile');
        }
      } catch (error) {
        message.error('오류가 발생했습니다. 다시 시도해주세요.');
        navigate('/login');
      }
    };

    const fetchGames = async (steamId) => {
      try {
        const response = await axiosInstance.get(`/steam/ownedGames`, {});
        //const response = await axiosInstance.get(`/steam/ownedGames`);
        const gamesInMinutes = response.data.response.games.map((game) => ({
          ...game,
          playtime_forever: game.playtime_forever / 60,
          img_icon_url: game.img_icon_url,
        }));
        setGames(gamesInMinutes);
      } catch (error) {
        console.error('Error fetching games:', error);
        message.error('게임 데이터를 가져오는 중 오류가 발생했습니다.');
      }
    };

    checkSteamLink();
  }, [navigate]);

  if (!hasSteamId) {
    return <div>Loading...</div>;
  }

  const sortedGames = games.sort(
    (a, b) => b.playtime_forever - a.playtime_forever
  );

  const truncate = (str, n) => {
    return str.length > n ? str.slice(0, n - 1) + '...' : str;
  };

  const formatXAxis = (tickItem) => {
    return tickItem.length > 10 ? tickItem.slice(0, 12) + '...' : tickItem;
  };

  const tooltipFormatter = (value, name, props) => {
    return [value, props.payload.name];
  };

  const formatYAxis = (tickItem) => {
    return new Intl.NumberFormat().format(tickItem);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div
        style={{
          backgroundImage: "url('../images/GameGraph_background.PNG')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          filter: 'blur(6px)', // 블러 효과
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0, // 배경 순서 위치
        }}
      ></div>

      <div style={{ position: 'relative', zIndex: 1, padding: '1px' }}>
        <Typography.Title
          level={4}
          style={{
            color: 'white',
            fontSize: '38px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
          }}
        >
          많이 플레이한 게임
        </Typography.Title>
        <Box>
          <ResponsiveContainer width="100%" height={1000}>
            <BarChart
              data={sortedGames.slice(0, 12)}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="appid"
                tick={({ x, y, payload }) => (
                  <CustomAxis x={x} y={y} payload={payload} games={games} />
                )}
              />
              <YAxis
                type="number"
                tickCount={9}
                tickFormatter={formatYAxis}
                label={{
                  value: '시간',
                  angle: 0,
                  position: 'insideLeft',
                  dx: -26,
                  dy: -50,
                  style: {
                    fontSize: '25px',
                    fontWeight: 'bold',
                    fill: '#FFFFFF',
                  }, // 레이블 스타일
                }}
                tick={{
                  fontSize: 24, // 숫자 글씨 크기
                  fontWeight: 'bold', // 숫자 글씨 굵게
                  fill: '#FFFFFF',
                  // 숫자 글씨 색상
                }}
              />
              <Tooltip />
              <Bar dataKey="playtime_forever" fill="#8CB6E1" /> // 그래프 색깔
              변경
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </div>
    </div>
  );
};

export default GameGraph;
