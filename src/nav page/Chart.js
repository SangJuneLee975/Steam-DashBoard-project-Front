import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Typography } from 'antd';
import axiosInstance from '../api/axiosInstance';
import { getUserInfoFromToken } from '../components/parsejwt';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts3d from 'highcharts/highcharts-3d';
import { Box } from '@mui/material';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

  const options = {
    chart: {
      type: 'pie',
      options3d: {
        enabled: true,
        alpha: 65,
        beta: 0,
      },
      backgroundColor: 'transparent',
      width: 1600,
      height: 1100,

      style: {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.4)',
        borderRadius: '15px',
      },
    },
    colors: [
      '#FFD1DC',
      '#FFB6C1',
      '#FF9AA2',
      '#FFCC99',
      '#FFD700',
      '#C5E384',
      '#B5EAD7',
      '#9DD9D2',
      '#AFCBFF',
      '#B39CD0',
    ],
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
        depth: 85,
        center: ['50%', '50%'],
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.y:.1f} 시간',
          style: {
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '24px',
            textOutline: '1px solid rgba(0, 0, 0, 0.5)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: '5px',
            borderRadius: '5px',
          },
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
          color: ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99'][index % 4],
        })),
      },
    ],
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
      itemStyle: {
        color: 'white',
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
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ position: 'relative', zIndex: 1, padding: '20px' }}>
        <Typography.Title
          level={4}
          style={{
            color: '#0ff',
            padding: '20px',
            fontSize: '39px',
            fontWeight: 'bold',
            textShadow: `
              0 0 5px #0ff,
              0 0 10px #0ff,
              0 0 20px #00f,
              0 0 30px #00f,
              0 0 40px #00f,
              0 0 50px #00f,
              0 0 75px #00f`,
            textAlign: 'center',
            marginTop: '-20px',
          }}
        >
          <FontAwesomeIcon icon={faGamepad} style={{ marginRight: '8px' }} />
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
