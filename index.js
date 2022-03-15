const { port } = require('./config');
const app = require('./app');

app.listen(port, () => {
  console.log(`Lannister-Pay running on port ${port}`);
});
