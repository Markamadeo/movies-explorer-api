const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://kulakov.students.nomoredomains.monster',
    'https://www.kulakov.students.nomoredomains.monster',
  ],
  methods: [
    'GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

export default corsOptions;
