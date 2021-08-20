export default {
  cors: {
    origin: ['http://localhost:8080'],
  },
  cookie: {
    httpOnly: true,
    path: '/',
  },
  maxHttpBufferSize: 1e6,
};
