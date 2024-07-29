import React, { useEffect, useState } from 'react';
import { Card, Table } from 'antd';
import axiosInstance from '../api/axiosInstance';

const GlobalAchievementPercentages = ({ gameid }) => {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await axiosInstance.get(`/steam/globalAchievements`, {
          params: { gameid },
        });
        setAchievements(response.data.achievements);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      }
    };

    fetchAchievements();
  }, [gameid]);

  const columns = [
    {
      title: 'Achievement Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Percentage',
      dataIndex: 'percent',
      key: 'percent',
    },
  ];

  return (
    <Card title="Global Achievement Percentages">
      <Table dataSource={achievements} columns={columns} rowKey="name" />
    </Card>
  );
};

export default GlobalAchievementPercentages;
