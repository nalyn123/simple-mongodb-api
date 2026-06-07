const express = require("express");
const connectToDb = require("./config/db");
const router = require("./routes/routes");
require("dotenv").config();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

connectToDb();

app.listen(process.env.PORT, () => {
  console.log(`app listening on port ${process.env.PORT}`);
});

app.use(router);
