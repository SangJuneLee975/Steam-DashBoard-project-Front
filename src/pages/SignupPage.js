import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const SignupPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isUserIdValid, setIsUserIdValid] = useState(false);

  // 아이디 중복 검사 함수
  const checkUserId = async () => {
    const userId = form.getFieldValue('userId'); // Form에서 userId 값 가져오기
    if (!userId) {
      message.error('아이디를 입력해 주세요.');
      return;
    }
    try {
      const response = await axios.get(
        `https://localhost:8080/user/checkUserId`,
        { params: { userId } }
      );
      if (response.data.isAvailable) {
        message.success('사용 가능한 아이디입니다.');
        setIsUserIdValid(true);
      } else {
        message.error('이미 사용중인 아이디입니다.');
        setIsUserIdValid(false);
      }
    } catch (error) {
      console.error('아이디 중복 확인 에러:', error);
      message.error('아이디 중복 확인 중 문제가 발생했습니다.');
      setIsUserIdValid(false);
    }
  };

  const onFinish = async (values) => {
    //  if (!isUserIdValid) {
    //    message.error('아이디 중복 확인이 필요합니다.');
    //     return;
    //  }
    setLoading(true);
    try {
      const response = await axios.post(
        'https://localhost:8080/user/signup',
        values
      );

      const backendMessage = response.data.message;
      message.success(backendMessage || '회원가입 성공');
      form.resetFields(); // 폼 초기화
    } catch (error) {
      console.error('회원가입 에러:', error);
      message.error('회원가입 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="userId"
        rules={[{ required: true, message: '아이디를 입력해주세요!' }]}
      >
        <Input
          addonAfter={<Button onClick={checkUserId}>중복 확인</Button>}
          placeholder="아이디"
        />
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
        name="passwordConfirm"
        dependencies={['password']}
        hasFeedback // 유효성 검사의 결과를 시각적으로 표시
        rules={[
          {
            required: true,
            message: '비밀번호 확인을 입력해주세요!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              // 유효성 검사를 수행
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
              );
            },
          }),
        ]}
      >
        <Input.Password placeholder="비밀번호 확인" />
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
