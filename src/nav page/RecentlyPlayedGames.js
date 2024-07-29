import React, { useEffect, useState } from 'react';
import { Card, List } from 'antd';
import axiosInstance from '../api/axiosInstance';

const RecentlyPlayedGames = ({ steamid }) => {
  const [recentGames, setRecentGames] = useState([]);

  useEffect(() => {
    const fetchRecentlyPlayedGames = async () => {
      try {
        const response = await axiosInstance.get(`/steam/recentlyPlayedGames`, {
          params: { steamId: steamid },
        });
        setRecentGames(response.data.games);
      } catch (error) {
        console.error('Error fetching recently played games:', error);
      }
    };

    fetchRecentlyPlayedGames();
  }, [steamid]);

  return (
    <Card title="최근 플레이한 게임">
      <List
        dataSource={recentGames}
        renderItem={(game) => (
          <List.Item>
            <List.Item.Meta
              title={game.name}
              description={`플레이 시간: ${game.playtime_2weeks} 분`}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentlyPlayedGames;
