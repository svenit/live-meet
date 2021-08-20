export default {
  port: 3001,
  options: {
    cors: {
      origin: ['http://localhost:8080'],
    },
    cookie: {
      httpOnly: true,
      path: '/',
    },
    maxHttpBufferSize: 1e6,
  },
};
