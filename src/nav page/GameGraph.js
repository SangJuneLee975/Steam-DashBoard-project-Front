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
          message.warning('스팀 계정을 연동해 주세요.');
          navigate('/profile');
        }
      } catch (error) {
        message.error('오류가 발생했습니다. 다시 시도해주세요.');
        navigate('/login');
      }
    };

    const fetchGames = async (steamId) => {
      try {
        const response = await axiosInstance.get(`/steam/ownedGames`);
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
    <div>
      <Typography.Title level={4}>많이 플레이한 게임</Typography.Title>
      <Box>
        <ResponsiveContainer width="100%" height={650}>
          <BarChart data={sortedGames.slice(0, 12)}>
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
                dx: -5,
              }}
            />
            <Tooltip />
            <Bar dataKey="playtime_forever" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </div>
  );
};

export default GameGraph;
