import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message, Typography, Card } from 'antd';
import axiosInstance from '../api/axiosInstance';
import { getUserInfoFromToken } from '../components/parsejwt';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const DashBoard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
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
          message.warning('스팀 계정을 연동해 주세요.');
          navigate('/profile');
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
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const handleGameClick = (appid) => {
    navigate(`/wordcloud/${appid}`);
  };

  return (
    <div>
      <Typography.Title level={4}>Steam 프로필</Typography.Title>
      {profile && (
        <div>
          <p>Steam ID: {profile.steamid}</p>
          <p>닉네임: {profile.personaname}</p>
          <p>
            프로필 URL: <a href={profile.profileurl}>{profile.profileurl}</a>
          </p>
        </div>
      )}
      <Typography.Title level={4}>소유한 게임 목록</Typography.Title>
      <Slider {...settings}>
        {games.map((game) => (
          <div key={game.appid}>
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
                    height: '100px',
                    objectFit: 'contain',
                  }}
                />
              }
            >
              <Card.Meta
                title={
                  <a onClick={() => handleGameClick(game.appid)}>{game.name}</a>
                }
                description={`게임 ID: ${game.appid}`}
              />
            </Card>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default DashBoard;
