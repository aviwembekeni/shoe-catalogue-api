module.exports = function(pool) {
  async function addShoe(brand, color, size, in_stock, price) {
    let shoes = await pool.query(
      "SELECT id FROM shoes WHERE brand = $1 AND color = $2 AND size = $3",
      [brand, color, size]
    );

    if (shoes.rowCount === 0) {
      await pool.query(
        "INSERT INTO shoes(color, brand, price, size, in_stock) VALUES($1, $2, $3, $4, $5)",
        [color, brand, price, size, in_stock]
      );
    } else {
      const shoeId = shoes.rows[0].id;
      await pool.query(
        "UPDATE shoes SET in_stock = in_stock + 1 WHERE shoes.id = $1",
        [shoeId]
      );
    }
  }

  async function getShoes() {
    const shoes = await pool.query("SELECT * FROM shoes");
    return shoes.rows;
  }

  async function getShoesByBrand(brand) {
    const filteredShoes = await pool.query(
      "SELECT * FROM shoes WHERE brand = $1",
      [brand]
    );
    return filteredShoes.rows;
  }

  async function getShoesBySize(size) {
    const filteredShoes = await pool.query(
      "SELECT * FROM shoes WHERE size = $1",
      [size]
    );
    return filteredShoes.rows;
  }

  async function getShoesByBrandAndSize(brand, size) {
    const filteredShoes = await pool.query(
      "SELECT * FROM shoes WHERE brand = $1 AND size = $2",
      [brand, size]
    );
    return filteredShoes.rows;
  }

  async function buyShoe(shoeId) {
    await pool.query(
      "UPDATE shoes SET in_stock = in_stock - 1 WHERE id = $1 AND in_stock > 0",
      [shoeId]
    );

    addShoeToShoppingBasket(shoeId);
  }

  async function addShoeToShoppingBasket(shoeId) {
    // check if basket already exist, if not create a new one

    let basketIds = await pool.query("SELECT id FROM shopping_basket");

    if (basketIds.rowCount === 0) {
      await pool.query(
        "INSERT INTO shopping_basket(basket_status) VALUES($1)",
        ["active"]
      );

      basketIds = await pool.query("SELECT id FROM shopping_basket");
    }

    let basketId = basketIds.rows[0].id;

    // check if item already exist, if it exist increment counter otherwise insert a new one into the table

    let newIds = await pool.query(
      "SELECT id FROM shopping_basket_item WHERE shoe_id = $1",
      [shoeId]
    );

    if (newIds.rowCount === 0) {
      let prices = await pool.query("SELECT price from shoes WHERE id = $1", [
        shoeId
      ]);

      let price = prices.rows[0].price;

      await pool.query(
        "INSERT INTO shopping_basket_item(basket_id, shoe_id, shoe_price, total_price, qty) VALUES($1, $2, $3, $4, $5)",
        [basketId, shoeId, price, price, 1]
      );
    } else {
      await pool.query(
        "UPDATE shopping_basket_item SET qty = qty + 1, total_price = shoe_price * (qty + 1) WHERE shoe_id = $1",
        [shoeId]
      );

      //await pool.query("UPDATE shopping_basket SET total = $1", [total]);
    }

    let totals = await pool.query(
      "SELECT SUM(total_price) AS total from shopping_basket_item"
    );

    let total = totals.rows[0].total;

    await pool.query("UPDATE shopping_basket SET total = $1", [total]);
  }

  async function getShoppingBaketItems() {
    const shopping_basket = await pool.query(
      "SELECT DISTINCT brand, color, size,qty, shoe_price, total_price, total from shopping_basket_item JOIN shoes ON shopping_basket_item.shoe_id = shoes.id JOIN shopping_basket ON shopping_basket.id = shopping_basket_item.basket_id;"
    );

    return shopping_basket.rows;
  }

  async function getShoppingBaket() {
    const shopping_basket = await pool.query("select * from shopping_basket");
    return shopping_basket.rows;
  }

  return {
    addShoe,
    getShoes,
    getShoesByBrand,
    getShoesBySize,
    getShoesByBrandAndSize,
    buyShoe,
    addShoeToShoppingBasket,
    getShoppingBaket,
    getShoppingBaketItems
  };
};
