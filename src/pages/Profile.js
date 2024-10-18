import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    axios
      .get('https://localhost:8080/api/profile', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => console.error('Error fetching user profile:', error));
  }, []);

  return (
    <div>
      <h1>프로필</h1>
      <p>이름: {user.name}</p>
      <p>이메일: {user.email}</p>
      <p>닉네임: {user.nickname}</p>
    </div>
  );
};

export default ProfilePage;
