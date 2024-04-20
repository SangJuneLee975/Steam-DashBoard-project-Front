import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, message } from 'antd';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { isLoggedInState } from '../recoil/atoms';

const LoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [googleAuthUrl, setGoogleAuthUrl] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);

  const fetchGoogleAuthUrl = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/oauth/google/login');
      setGoogleAuthUrl(data);
    } catch (error) {
      console.error('구글 인증 URL 가져오기 실패:', error);
    }
  }, []);

  const handleGoogleCallback = useCallback(
    async (code) => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `/oauth/google/callback?code=${code}`
        );
        const { accessToken } = response.data;

        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          setIsLoggedIn(true); // 상태 업데이트
          message.success('로그인 성공');
          navigate('/'); // 페이지 이동
        } else {
          message.error('로그인 실패: 서버로부터 올바른 토큰을 받지 못함');
        }
      } catch (error) {
        message.error('로그인 중 문제가 발생했습니다.');
        console.error('로그인 에러:', error);
      } finally {
        setLoading(false);
      }
    },
    [navigate, setIsLoggedIn]
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const token = urlParams.get('token');

    if (code && !token) {
      handleGoogleCallback(code);
    } else if (token) {
      localStorage.setItem('accessToken', token);
      setIsLoggedIn(true);
      message.success('로그인 성공');
      navigate('/');
      window.history.replaceState(null, null, window.location.pathname);
    } else {
      fetchGoogleAuthUrl();
    }
  }, [navigate, setIsLoggedIn, handleGoogleCallback, fetchGoogleAuthUrl]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/user/login', values);
      const { accessToken, refreshToken, redirectUrl } = response.data;

      if (accessToken && refreshToken) {
        localStorage.setItem('accessToken', accessToken); // 액세스 토큰 저장
        localStorage.setItem('refreshToken', refreshToken); // 리프레시 토큰 저장

        message.success('로그인 성공');

        navigate(redirectUrl || '/');
      } else {
        message.error('로그인 실패: 서버로부터 올바른 토큰을 받지 못함');
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || '로그인 중 문제가 발생했습니다.';
      message.error(errorMsg);
      console.error('로그인 에러:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log(
      'Google 로그인 버튼 클릭됨, 인증 URL로 리다이렉트: ',
      googleAuthUrl
    );
    window.location.href = googleAuthUrl; // 구글 인증 페이지로 리다이렉트
  };

  return (
    <Form form={form} name="login" onFinish={onFinish} scrollToFirstError>
      <Form.Item
        name="username"
        rules={[{ required: true, message: '아이디를 입력해주세요!' }]}
      >
        <Input placeholder="아이디" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: '비밀번호를 입력해주세요!' }]}
      >
        <Input.Password placeholder="비밀번호" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          로그인
        </Button>
      </Form.Item>

      <Form.Item>
        <Button type="primary" onClick={handleGoogleLogin}>
          구글 로그인
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginPage;
