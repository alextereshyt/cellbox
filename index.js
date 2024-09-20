import express from 'express';

const app = express();
const port = 3000;

app.use(express.static('public')); // Serve static files

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});