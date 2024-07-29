import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const CurrentPlayers = ({ appid }) => {
  const [playerCount, setPlayerCount] = useState(null);

  useEffect(() => {
    const fetchPlayerCount = async () => {
      try {
        const response = await axiosInstance.get('/steam/currentPlayers', {
          params: { appid },
        });
        setPlayerCount(response.data.player_count);
      } catch (error) {
        console.error('Error fetching player count:', error);
      }
    };

    fetchPlayerCount();
  }, [appid]);

  return (
    <div>
      <h3></h3>
      {playerCount !== null ? <p>{}</p> : <p></p>}
    </div>
  );
};

export default CurrentPlayers;
