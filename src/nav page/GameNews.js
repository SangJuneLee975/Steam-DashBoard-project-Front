import React, { useEffect, useState } from 'react';
import { Card, List } from 'antd';
import axiosInstance from '../api/axiosInstance';

const GameNews = ({ appid }) => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchGameNews = async () => {
      try {
        const response = await axiosInstance.get(`/steam/reviews`, {
          params: { appId: appid },
        });
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching game news:', error);
      }
    };

    fetchGameNews();
  }, [appid]);

  return (
    <Card title="게임 뉴스">
      <List
        dataSource={news}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              }
              description={item.contents}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default GameNews;
