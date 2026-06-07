const express = require("express");
const connectToDb = require("./config/db");
const router = require("./routes/routes");
require("dotenv").config();

const app = express();
app.use(express.json());

connectToDb();

app.listen(process.env.PORT, () => {
  console.log(`app listening on port ${process.env.PORT}`);
});

app.use(router);
