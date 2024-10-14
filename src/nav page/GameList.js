import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Typography, Card } from 'antd';
import axiosInstance from '../api/axiosInstance';
import { getUserInfoFromToken } from '../components/parsejwt';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';

const ProfileInfo = styled.div`
  margin-bottom: 20px;
`;

const GameCard = styled.div`
  text-align: center;

  img {
    width: 100%;
    height: 100px;
    object-fit: contain;
  }

  a {
    color: ${(props) => props.theme.colors.main};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const GameList = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
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
          fetchSteamData(userInfo.steamId);
        } else {
          setHasSteamId(true);
        }
      } catch (error) {
        console.error('Failed to check steam link:', error);
        message.error('오류가 발생했습니다. 다시 시도해주세요.');
        navigate('/login');
      }
    };

    const fetchSteamData = async (steamId) => {
      try {
        const profileResponse = await axiosInstance.get(`/steam/profile`, {
          params: { steamId },
        });
        setProfile(profileResponse.data);

        const gamesResponse = await axiosInstance.get(`/steam/ownedGames`, {
          params: { steamId },
        });
        setGames(gamesResponse.data.response.games);
      } catch (error) {
        console.error('Error fetching steam data:', error);
        message.error('스팀 데이터를 가져오는 중 오류가 발생했습니다.');
      }
    };

    checkSteamLink();
  }, [navigate]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: 'block', fontSize: '30px', color: 'black' }}
        onClick={onClick}
      >
        &gt;
      </div>
    );
  };

  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: 'block', fontSize: '30px', color: 'black' }}
        onClick={onClick}
      >
        &lt;
      </div>
    );
  };

  const settings = {
    dots: true,
    dotsClass: 'slick-dots custom-dots',
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    prevArrow: <PrevArrow />,
  };

  const handleGameClick = (appid) => {
    navigate(`/wordcloud/${appid}`);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div
        style={{
          backgroundImage: "url('/images/GameList_background.PNG')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          filter: 'blur(2px)',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0, // 배경이 뒤쪽에 배치되도록 설정
        }}
      ></div>

      <div style={{ position: 'relative', zIndex: 1, padding: '1px' }}>
        <Typography.Title level={4}></Typography.Title>
        {profile && (
          <div>
            <p> {profile.steamid}</p>
            <p> {profile.personaname}</p>
            <p>
              <a href={profile.profileurl}>{profile.profileurl}</a>
            </p>
          </div>
        )}
        <Typography.Title
          level={4}
          style={{
            color: 'white',
            fontSize: '28px',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
          }}
        >
          소유한 게임 목록
        </Typography.Title>
        <Slider {...settings}>
          {games.map((game) => (
            <div key={game.appid} style={{ padding: '20px' }}>
              {' '}
              {/* 카드 사이 간격 */}
              <Card
                cover={
                  <img
                    alt={game.name}
                    src={
                      game.img_logo_url
                        ? `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`
                        : `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
                    }
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'contain',
                      marginTop: '3px',
                    }}
                  />
                }
              >
                <Card.Meta
                  title={
                    <a onClick={() => handleGameClick(game.appid)}>
                      {game.name}
                    </a>
                  }
                />
              </Card>
            </div>
          ))}
        </Slider>

        {/* dots 색상 Custom */}
        <style>
          {`
    .slick-dots.custom-dots li button:before {
      color: white; /* dots 색상 */
      font-size: 14px; /* dots 크기 조절 */
      font-weight: bold; /* dots를 굵게 설정 */
    }
    .slick-dots.custom-dots li.slick-active button:before {
      color: white;
      font-size: 14px;
      font-weight: bold;
    }
  `}
        </style>
      </div>
    </div>
  );
};

export default GameList;
