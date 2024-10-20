import React, { useEffect, useState } from 'react';
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
    <div style={styles.container}>
      {player ? (
        <div style={styles.profileWrapper}>
          <p style={styles.playerName}>Name: {player.personaname}</p>
          <img src={player.avatarfull} alt="Avatar" style={styles.avatar} />
        </div>
      ) : (
        <p style={styles.loadingText}>Loading...</p>
      )}
    </div>
  );
};

const styles = {
  profileWrapper: {
    display: 'inline-block',
    textAlign: 'center',
  },
  playerName: {
    fontSize: '1.6em',
    fontWeight: 'bold',
    marginBottom: '1px',
    color: '#333',
  },
  avatar: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    objectFit: 'cover',
    margin: '0 auto',
  },
  loadingText: {
    fontSize: '1em',
    color: '#777',
  },
};

export default PlayerSummary;
