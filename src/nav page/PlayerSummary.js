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
    <div style={{ textAlign: 'center' }}>
      {player ? (
        <div>
          <p style={{ marginBottom: '8px' }}>Name: {player.personaname}</p>
          <img
            src={player.avatarfull}
            alt="Avatar"
            style={{ width: '80px', height: '80px', borderRadius: '50%' }} // 이미지 크기 조정 및 둥근 테두리 적용
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PlayerSummary;
