const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const PORT = 4000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(cookieParser());
