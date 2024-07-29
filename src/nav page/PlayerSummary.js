import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import axiosInstance from '../api/axiosInstance';

const PlayerSummary = ({ steamid }) => {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const response = await axiosInstance.get('/steam/steamProfile', {
          params: { steamId: steamid },
        });
        setPlayer(response.data);
      } catch (error) {
        console.error('Error fetching player summary:', error);
      }
    };

    fetchPlayer();
  }, [steamid]);

  return (
    <Card title="사용자 정보">
      {player ? (
        <div>
          <p>Name: {player.personaname}</p>
          {/*<p>
            Profile URL:{' '}
            <a
              href={player.profileurl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {player.profileurl}
            </a>
          </p>
          <p>Status: {player.personastate}</p>*/}
          <img src={player.avatarfull} alt="Avatar" />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </Card>
  );
};

export default PlayerSummary;
