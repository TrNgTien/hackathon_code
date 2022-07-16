const express = require('express');
const app = express();
const routes = require('./routes/index');
const db_connection = require('./config/db_connection');
db_connection.connect();

const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());

routes(app);

app.listen(5000, () => {
  console.log(`Server is running on port http://localhost:5000`);
});

