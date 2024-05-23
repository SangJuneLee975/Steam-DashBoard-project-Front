import { atom } from 'recoil';

export const isLoggedInState = atom({
  key: 'isLoggedInState',
  default: !!localStorage.getItem('accessToken'),
});

export const nicknameState = atom({
  key: 'nicknameState',
  default: '',
});

export const userNameState = atom({
  key: 'userNameState',
  default: '',
});

export const accessTokenState = atom({
  key: 'accessTokenState',
  default: localStorage.getItem('accessToken') || '',
});

export const socialCodeState = atom({
  key: 'socialCodeState',
  default: null, // 기본값은 null
});
