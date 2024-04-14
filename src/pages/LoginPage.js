import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { getUserInfoFromToken } from '../components/parsejwt';

const LoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/user/login', values);
      const { accessToken, refreshToken } = response.data; // 닉네임을 추출합니다.
      const userInfo = getUserInfoFromToken(accessToken);
      console.log('로그인 후 받은 사용자 정보: ', userInfo);
      if (accessToken && refreshToken) {
        localStorage.setItem('accessToken', accessToken); // 액세스 토큰 저장
        localStorage.setItem('refreshToken', refreshToken); // 리프레시 토큰 저장

        message.success('로그인 성공');
        navigate('/');
      } else {
        // 토큰이 없는 경우 에러 메시지 출력
        message.error('로그인 실패: 서버로부터 올바른 토큰을 받지 못함');
      }
    } catch (error) {
      // 오류 발생 시 오류 메시지 출력
      const errorMsg =
        error.response?.data?.message || '로그인 중 문제가 발생했습니다.';
      message.error(errorMsg);
      console.error('로그인 에러:', error);
    } finally {
      setLoading(false);
    }
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
    </Form>
  );
};

export default LoginPage;
