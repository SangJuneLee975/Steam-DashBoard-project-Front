import axios from 'axios';

// Axios �ν��Ͻ� ����
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
});

// ��û ���ͼ��� �߰�
axiosInstance.interceptors.request.use(
  (config) => {
    // ���� ���丮������ �׼��� ��ū�� ������
    const accessToken = localStorage.getItem('accessToken');
    // �׼��� ��ū�� �ִٸ� ��û ����� �߰�
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
    // �׼��� ��ū�� ����Ǿ�  ������ �߻��� ���, �������� ��ū���� �׼��� ��ū�� ����
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axiosInstance.post('/user/refresh', {
          refreshToken,
        });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken); // �� �׼��� ��ū ����
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`; // ���ŵ� �׼��� ��ū���� ��û ��� ����
        return axiosInstance(originalRequest); // ��û ��õ�
      } catch (refreshError) {
        console.error('�׼��� ��ū ���� ����:', refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
