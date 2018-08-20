const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");
const pg = require("pg");
const Pool = pg.Pool;
const ShoeCatalogue = require("./shoe-catalogue");

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

const shoeCatalogue = ShoeCatalogue(pool);

app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use(express.static("public"));

app.get("/api/shoes", async function(req, res, next) {
  try {
    let shoes = await shoeCatalogue.getShoes();
    let shoppingBasketItems = await shoeCatalogue.getShoppingBaketItems();
    res.json({
      shoes,
      shoppingBasketItems
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/shoes/brand/:brandname", async function(req, res, next) {});

app.get("/api/shoes/size/:size", async function(req, res, next) {});

app.get("/api/shoes/brand/:brandname/size/:size", async function(
  req,
  res,
  next
) {});

app.post("/api/shoes/sold/:id", async function(req, res, next) {
  try {
    const shoeId = req.params.id;

    if (shoeId !== "" && shoeId !== undefined) {
      await shoeCatalogue.buyShoe(shoeId);
      let shoes = await shoeCatalogue.getShoes();

      res.json(shoes);
    } else {
      res.status(400).json("Shoe id is null or undefined");
    }
  } catch (error) {
    next(error);
  }
});

app.post("/api/shoes", async function(req, res, next) {});

app.listen(PORT, () => {
  console.log(`app is running on PORT ${PORT}`);
});
