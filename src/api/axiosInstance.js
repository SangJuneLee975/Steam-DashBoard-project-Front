import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || 'https://localhost:8080';
//const apiUrl = process.env.REACT_APP_API_URL || 'https://stdash.shop';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 추가
axiosInstance.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 액세스 토큰을 가져옴
    const accessToken = localStorage.getItem('accessToken');
    // 액세스 토큰이 있다면 요청 헤더에 추가
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // 액세스 토큰이 만료되어  에러가 발생한 경우, 리프레시 토큰으로 액세스 토큰을 갱신
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axiosInstance.post('/user/refresh', {
          refreshToken,
        });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken); // 새 액세스 토큰 저장
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`; // 갱신된 액세스 토큰으로 요청 헤더 설정
        return axiosInstance(originalRequest); // 요청 재시도
      } catch (refreshError) {
        console.error('액세스 토큰 갱신 실패:', refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
