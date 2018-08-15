"Use strict";
const assert = require("assert");
const pg = require("pg");
const Pool = pg.Pool;

let useSSL = false;
if (process.env.DATABASE_URL) {
  useSSL = true;
}

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:lavish@localhost:5432/shoe-catalogue-test",
  ssl: useSSL
});

const ShoeCatalogue = require("../shoe-catalogue");

describe("addShoes", function() {
  beforeEach(async function() {
    await pool.query("delete from shopping_basket_item");
    await pool.query("delete from shopping_basket");
    await pool.query("delete from shoes");
  });
});
