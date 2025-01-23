require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { billRoute, gptRoute, customBillRoute } = require("../routes");
const dbConfig = require("../config/dbConfig");

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api", gptRoute);
app.use("/api", billRoute);
app.use("/api", customBillRoute);

app.get("*", (req, res) => {
  res.send("Don't hit me please!");
});

dbConfig(app);
