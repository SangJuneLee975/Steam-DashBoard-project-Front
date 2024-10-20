import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Typography } from 'antd';
import axiosInstance from '../api/axiosInstance';
import { getUserInfoFromToken } from '../components/parsejwt';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3d from 'highcharts/highcharts-3d';
import { Box } from '@mui/material';

// 3D 모듈 로드
Highcharts3d(Highcharts);

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
        if (userInfo && userInfo.steamId) {
          setHasSteamId(true);
          fetchRecentlyPlayedGames(userInfo.steamId);
        } else {
          setHasSteamId(true);
          message.warning('스팀 계정을 연동해 주세요.');
        }
      } catch (error) {
        console.error('Failed to check steam link:', error);
        message.error('오류가 발생했습니다. 다시 시도해주세요.');
        navigate('/login');
      }
    };

    const fetchRecentlyPlayedGames = async (steamId) => {
      try {
        const response = await axiosInstance.get(`/steam/recentlyPlayedGames`, {
          params: { steamId },
        });
        const gamesInMinutes = response.data.response.games.map((game) => ({
          ...game,
          playtime_2weeks: game.playtime_2weeks / 60,
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

  const sortedGames = recentlyPlayedGames.sort(
    (a, b) => b.playtime_2weeks - a.playtime_2weeks
  );

  // Highcharts 3D PieChart 옵션 설정
  const options = {
    chart: {
      type: 'pie',
      options3d: {
        enabled: true,
        alpha: 55,
        beta: 0,
      },
      backgroundColor: 'transparent', // 배경색 투명으로 설정
      width: 1600, // 차트 너비를 고정 크기로 설정
      height: 900, // 차트 높이를 고정 크기로 설정
    },
    title: {
      text: '',
      style: {
        color: 'white',
        fontSize: '28px',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
      },
    },
    accessibility: {
      point: {
        valueSuffix: '시간',
      },
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        depth: 35,
        center: ['50%', '50%'], // 차트를 화면의 가로, 세로 중앙에 배치
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.y:.1f} 시간',
        },
      },
    },
    series: [
      {
        type: 'pie',
        name: '플레이 시간',
        data: sortedGames.slice(0, 12).map((game, index) => ({
          name: game.name,
          y: game.playtime_2weeks,
        })),
      },
    ],
    legend: {
      align: 'center', // 범례를 중앙에 정렬
      verticalAlign: 'bottom', // 범례를 하단에 위치
      layout: 'horizontal', // 범례를 가로로 배열
      itemStyle: {
        color: 'white', // 범례 텍스트 색상
        fontSize: '18px',
      },
    },
  };

  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: "url('../images/Chart_background.PNG')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        padding: '20px',
        display: 'flex',
        justifyContent: 'center', // 부모 컨테이너에서 중앙 정렬
        alignItems: 'center',
      }}
    >
      <div style={{ position: 'relative', zIndex: 1, padding: '20px' }}>
        <Typography.Title
          level={4}
          style={{
            color: 'white',
            padding: '20px',
            fontSize: '39px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
            textAlign: 'center',
            marginTop: '-320px', // 텍스트를 위로 20px 이동
          }}
        >
          최근 2주 동안 플레이한 게임
        </Typography.Title>
        <Box>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </Box>
      </div>
    </main>
  );
};

export default Chart;
