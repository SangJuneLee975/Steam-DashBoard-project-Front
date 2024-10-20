import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Typography } from 'antd';
import axiosInstance from '../api/axiosInstance';
import { getUserInfoFromToken } from '../components/parsejwt';
import '../css/GameList.css';

const GameList = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 페이지당 표시할 게임 수

  useEffect(() => {
    const fetchProfileAndGames = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const userInfo = getUserInfoFromToken(token);
        if (userInfo && userInfo.steamId) {
          const profileResponse = await axiosInstance.get('/steam/profile', {
            params: { steamId: userInfo.steamId },
          });
          setProfile(profileResponse.data);

          const gamesResponse = await axiosInstance.get('/steam/ownedGames', {
            params: { steamId: userInfo.steamId },
          });
          setGames(gamesResponse.data.response.games);
        } else {
          message.warning('스팀 계정을 연동해 주세요.');
        }
      } catch (error) {
        console.error('프로필 및 게임 데이터를 가져오는 중 오류 발생:', error);
        message.error('오류가 발생했습니다. 다시 시도해주세요.');
      }
    };

    fetchProfileAndGames();
  }, [navigate]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  const handleGameClick = (appid) => {
    navigate(`/wordcloud/${appid}`);
  };

  const totalPages = Math.ceil(games.length / itemsPerPage);
  const indexOfLastGame = currentPage * itemsPerPage;
  const indexOfFirstGame = indexOfLastGame - itemsPerPage;
  const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="background"></div>
      <div className="content">
        <Typography.Title level={4} className="gradient-text">
          소유한 게임 목록
        </Typography.Title>
        <div className="scene">
          <div className="carousel">
            {currentGames.map((game, index) => (
              <div
                key={game.appid}
                className="item"
                style={{
                  backgroundImage: `url(http://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/library_600x900.jpg)`,
                  transform: `rotateY(${
                    index * (360 / itemsPerPage)
                  }deg) translateZ(565px)`, // 캐러셀 크기
                  width: '300px',
                  height: '450px',
                }}
                onClick={() => handleGameClick(game.appid)}
              >
                <div className="game-title">{game.name}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            이전
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameList;
