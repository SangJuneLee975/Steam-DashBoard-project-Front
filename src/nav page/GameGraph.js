import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Typography } from 'antd';
import { getUserInfoFromToken } from '../components/parsejwt';
import axiosInstance from '../api/axiosInstance';
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

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const game = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          color: '#fff',
          padding: '10px',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <img
          src={`http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
          alt={game.name}
          style={{ width: '100px', height: '100px', marginBottom: '10px' }}
        />
        <p>{game.name}</p>
        <p>{`${game.playtime_forever.toFixed(2)} 시간 플레이`}</p>
      </div>
    );
  }

  return null;
};

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
        }
      } catch (error) {
        message.error('오류가 발생했습니다. 다시 시도해주세요.');
        navigate('/login');
      }
    };

    const fetchGames = async (steamId) => {
      try {
        const response = await axiosInstance.get(`/steam/ownedGames`, {});
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
          zIndex: 0,
        }}
      ></div>

      <div style={{ position: 'relative', zIndex: 1, padding: '1px' }}>
        <Box>
          <ResponsiveContainer width="100%" height={1300}>
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
                  },
                }}
                tick={{
                  fontSize: 24, // 숫자 글씨 크기
                  fontWeight: 'bold', // 숫자 글씨 굵게
                  fill: '#FFFFFF', // 숫자 글씨 색상
                }}
              />

              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="playtime_forever" fill="#8CB6E1" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </div>
    </div>
  );
};

export default GameGraph;
