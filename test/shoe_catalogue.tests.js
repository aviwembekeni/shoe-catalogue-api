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

  it("should return updated shoes with new shoe", async function() {
    let shoeCatalogue = ShoeCatalogue(pool);

    await shoeCatalogue.addShoe("Tommy Helfigure", "brown", 8, 9, 570);
    let shoes = await shoeCatalogue.getShoes();

    assert.equal(shoes[0].color, "brown");
    assert.equal(shoes[0].brand, "Tommy Helfigure");
    assert.equal(shoes[0].in_stock, 9);
    assert.equal(shoes[0].price, 570);
  });

  it("should return updated shoes with in_stock incremented", async function() {
    let shoeCatalogue = ShoeCatalogue(pool);

    await shoeCatalogue.addShoe("Tommy Helfigure", "brown", 8, 9, 570);
    await shoeCatalogue.addShoe("Tommy Helfigure", "brown", 8, 12, 400);
    let shoes = await shoeCatalogue.getShoes();

    assert.equal(shoes[0].color, "brown");
    assert.equal(shoes[0].brand, "Tommy Helfigure");
    assert.equal(shoes[0].in_stock, 10);
    assert.equal(shoes[0].price, 570);
  });
});

describe("getShoesBySize", function() {
  beforeEach(async function() {
    await pool.query("delete from shopping_basket_item");
    await pool.query("delete from shopping_basket");
    await pool.query("delete from shoes");
  });

  it("should return shoes filtered by size", async function() {
    let shoeCatalogue = ShoeCatalogue(pool);

    await shoeCatalogue.addShoe("Tommy Helfigure", "brown", 8, 9, 570);
    await shoeCatalogue.addShoe("Lacoste", "maroon", 9, 7, 900);
    let shoes = await shoeCatalogue.getShoesBySize(9);

    assert.equal(shoes.length, 1);
    assert.equal(shoes[0].color, "maroon");
    assert.equal(shoes[0].brand, "Lacoste");
    assert.equal(shoes[0].in_stock, 7);
    assert.equal(shoes[0].price, 900);
  });
});

describe("getShoesByBrandAndSize", function() {
  beforeEach(async function() {
    await pool.query("delete from shopping_basket_item");
    await pool.query("delete from shopping_basket");
    await pool.query("delete from shoes");
  });

  it("should return shoes filtered by size", async function() {
    let shoeCatalogue = ShoeCatalogue(pool);

    await shoeCatalogue.addShoe("Tommy Helfiger", "brown", 8, 9, 570);
    await shoeCatalogue.addShoe("Lacoste", "maroon", 9, 7, 900);
    await shoeCatalogue.addShoe("Tommy Helfiger", "brown", 7, 4, 570);
    await shoeCatalogue.addShoe("Lacoste", "maroon", 7, 7, 900);

    let shoes = await shoeCatalogue.getShoesByBrandAndSize("Tommy Helfiger", 7);

    assert.equal(shoes.length, 1);
    assert.equal(shoes[0].color, "brown");
    assert.equal(shoes[0].brand, "Tommy Helfiger");
    assert.equal(shoes[0].in_stock, 4);
    assert.equal(shoes[0].price, 570);
  });
});

describe("getShoesByBrand", function() {
  beforeEach(async function() {
    await pool.query("delete from shopping_basket_item");
    await pool.query("delete from shopping_basket");
    await pool.query("delete from shoes");
  });

  it("should return shoes shoes filtered by brand", async function() {
    let shoeCatalogue = ShoeCatalogue(pool);

    await shoeCatalogue.addShoe("Tommy Helfigure", "brown", 8, 9, 570);
    await shoeCatalogue.addShoe("Lacoste", "maroon", 9, 7, 900);
    let shoes = await shoeCatalogue.getShoesByBrand("Lacoste");

    assert.equal(shoes.length, 1);
    assert.equal(shoes[0].color, "maroon");
    assert.equal(shoes[0].brand, "Lacoste");
    assert.equal(shoes[0].in_stock, 7);
    assert.equal(shoes[0].price, 900);
  });

  after(async function() {
    await pool.end();
  });
});
