import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import '../css/Profile.css';

const ProfileUpdate = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/user/profile');
        setUser(response.data);
        form.setFieldsValue(response.data);
      } catch (error) {
        console.error('프로필 불러오기 실패:', error);
        message.error('프로필 정보를 불러오는데 실패했습니다.');
      }
    };

    fetchProfile();
  }, [form]);

  const handleEmailClick = () => {
    if (user.isSocial) {
      message.info('소셜 로그인 사용자는 이메일을 변경할 수 없습니다.');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.put('/user/updateProfile', values);
      setUser(response.data); // 업데이트 된 사용자 정보로 상태 업데이트
      message.success('프로필이 성공적으로 업데이트되었습니다.');
      navigate('/profile');
    } catch (error) {
      console.error('프로필 업데이트 실패:', error);
      message.error('프로필 업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 폼에 초기값 설정
  form.setFieldsValue(user);

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <h1>회원정보 수정</h1>

      <Form.Item
        name="email"
        label="이메일"
        rules={[{ type: 'email', message: '유효한 이메일을 입력해주세요.' }]}
        className="form-item"
      >
        <Input disabled={user.isSocial} />
      </Form.Item>

      <Form.Item
        name="name"
        label="이름"
        rules={[{ required: true, message: '이름을 입력해주세요.' }]}
        className="form-item"
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="nickname"
        label="닉네임"
        rules={[{ required: true, message: '닉네임을 입력해주세요.' }]}
        className="form-item"
      >
        <Input />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={loading}>
        회원정보 수정
      </Button>
    </Form>
  );
};

export default ProfileUpdate;
