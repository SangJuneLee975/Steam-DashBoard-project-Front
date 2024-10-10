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
    allowedHosts: 'all', // ��� ȣ��Ʈ�� ����մϴ�.
    https: true, // HTTPS Ȱ��ȭ (���� �ʿ� ���ٸ� false�� ����)
    port: 3000, // ����Ʈ �⺻ ��Ʈ
  },
};
