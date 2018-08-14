const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");
const pg = require("pg");
const Pool = pg.Pool;

const app = express();

let PORT = process.env.PORT || 3000;

let useSSL = false;
if (process.env.DATABASE_URL) {
  useSSL = true;
}

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:lavish@localhost:5432/shoe-catalogue";

const pool = new Pool({
  connectionString,
  ssl: useSSL
});

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("working");
});

app.get("/api/shoes", (req, res) => {});

app.get("/api/shoes/brand/:brandname", (req, res) => {});

app.get("/api/shoes/size/:size", (req, res) => {});

app.get("/api/shoes/brand/:brandname/size/:size", (req, res) => {});

app.post("/api/shoes/sold/:id", (req, res) => {});

app.post("/api/shoes");

app.listen(PORT, () => {
  console.log(`app is running on PORT ${PORT}`);
});
