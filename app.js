require('dotenv').config();

const express = require('express');
const cors = require('cors');

// db connection
require('./models');

const PORT = process.env.PORT ? process.env.PORT : 3005;
const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

app.use('/v1', require('./routes/index'));

app.listen(PORT, () => {
  console.log('Express server listening on port ' + PORT);
});