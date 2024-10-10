import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Typography } from 'antd';
import axiosInstance from '../api/axiosInstance';
import { getUserInfoFromToken } from '../components/parsejwt';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box } from '@mui/material';

const Chart = () => {
  const navigate = useNavigate();
  const [hasSteamId, setHasSteamId] = useState(false);
  const [recentlyPlayedGames, setRecentlyPlayedGames] = useState([]);

  useEffect(() => {
    const checkSteamLink = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const userInfo = getUserInfoFromToken(token);
        console.log('User Info fetched from token: ', userInfo);
        if (userInfo && userInfo.steamId) {
          setHasSteamId(true);
          fetchRecentlyPlayedGames(userInfo.steamId);
        } else {
          setHasSteamId(true);
          message.warning('스팀 계정을 연동해 주세요.');
          //  navigate('/profile');
        }
      } catch (error) {
        console.error('Failed to check steam link:', error);
        message.error('오류가 발생했습니다. 다시 시도해주세요.');
        navigate('/login');
      }
    };

    const fetchRecentlyPlayedGames = async (steamId) => {
      try {
        console.log(`Fetching recently played games for SteamId: ${steamId}`);
        const response = await axiosInstance.get(`/steam/recentlyPlayedGames`, {
          params: { steamId },
        });
        console.log('Recently played games response: ', response); // 응답 로그 추가
        const gamesInMinutes = response.data.response.games.map((game) => ({
          ...game,
          playtime_2weeks: game.playtime_2weeks / 60, // 시간을 분으로 변환
        }));
        setRecentlyPlayedGames(gamesInMinutes);
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

  const truncate = (str, n) => {
    return str.length > n ? str.slice(0, n - 1) + '...' : str;
  };

  const sortedGames = recentlyPlayedGames.sort(
    (a, b) => b.playtime_2weeks - a.playtime_2weeks
  );

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#A28EEC',
    '#82CA9D',
    '#8884D8',
    '#8DD1E1',
    '#83A6ED',
    '#8B5CF6',
    '#D88A4B',
    '#A4DE6C',
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    // 퍼센트 표새해주는 함수
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div
        style={{
          backgroundImage: "url('../images/Chart_background.PNG')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          filter: 'blur(5px)', // 블러 효과
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0, // 배경 순서 위치
        }}
      ></div>

      <div style={{ position: 'relative', zIndex: 1, padding: '20px' }}>
        <Typography.Title level={4}>
          최근 2주 동안 플레이한 게임
        </Typography.Title>
        <Box>
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                data={sortedGames.slice(0, 12)}
                dataKey="playtime_2weeks"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
                fill="#8884d8"
                labelLine={false}
                label={renderCustomizedLabel} // 커스텀 라벨
              >
                {sortedGames.slice(0, 12).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} 시간`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </div>
    </div>
  );
};

export default Chart;
