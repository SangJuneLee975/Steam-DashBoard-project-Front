const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      zlib: require.resolve('browserify-zlib'),
      querystring: require.resolve('querystring-es3'),
      path: require.resolve('path-browserify'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      http: require.resolve('stream-http'),
      url: require.resolve('url/'),
      util: require.resolve('util/'),
    },
  },

  devServer: {
    allowedHosts: 'all', // 모든 호스트를 허용합니다.
    https: true, // HTTPS 활성화 (만약 필요 없다면 false로 설정)
    port: 3000, // 리액트 기본 포트
  },
};
