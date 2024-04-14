import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const SignupPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8080/user/signup',
        values
      );
      const data = response.data;
      if (data.token) {
        message.success('회원가입 성공');
        form.resetFields();
      } else {
        message.error('회원가입 실패');
      }
    } catch (error) {
      console.error('회원가입 에러:', error);
      message.error('회원가입 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} name="register" onFinish={onFinish} scrollToFirstError>
      <Form.Item
        name="userId"
        rules={[
          {
            required: true,
            message: '아이디를 입력해주세요!',
          },
        ]}
      >
        <Input placeholder="아이디" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: '비밀번호를 입력해주세요!',
          },
        ]}
      >
        <Input.Password placeholder="비밀번호" />
      </Form.Item>

      <Form.Item
        name="name"
        rules={[
          {
            required: true,
            message: '이름을 입력해주세요!',
          },
        ]}
      >
        <Input placeholder="이름" />
      </Form.Item>

      <Form.Item
        name="nickname"
        rules={[
          {
            required: true,
            message: '닉네임을 입력해주세요!',
          },
        ]}
      >
        <Input placeholder="닉네임" />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: '이메일을 입력해주세요!',
          },
          {
            type: 'email',
            message: '유효한 이메일 주소를 입력해주세요!',
          },
        ]}
      >
        <Input placeholder="이메일" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          회원가입
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignupPage;
