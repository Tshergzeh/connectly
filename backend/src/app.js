const express = require('express');
const app = express();
const port = 3000;

const healthRoutes = require('./routes/health.routes');
const authRoutes = require('./routes/auth.routes');

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', healthRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
