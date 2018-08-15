module.exports = function(pool) {
  async function addShoe(brand, color, size, in_stock, price) {
    await pool.query(
      "INSERT INTO shoes(color, brand, price, size, in_stock) VALUES($1, $2, $3, $4, $5)",
      [color, brand, price, size, in_stock]
    );
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
    // check if basket already exist, if notr create a new one

    let basketIds = await pool.query("SELECT id FROM shopping_basket");

    if (basketIds.rowCount === 0) {
      await pool.query(
        "INSERT INTO shopping_basket(basket_status) VALUES($1)",
        ["active"]
      );

      basketIds = await pool.query("SELECT id FROM shopping_basket");
    }

    let basketId = basketIds.rows[0];

    // check if item already exist, if it exist increment counter otherwise insert a new one into the table

    let newIds = await pool.query(
      "SELECT id FROM shopping_basket_item WHERE shoe_id = $1",
      [shoeId]
    );

    if (newIds.rowCount === 0) {
      let price = pool.query("SELECT price from shoes WHERE id = $1", [shoeId]);
      await pool.query(
        "INSERT INTO shopping_basket_item(basket_id, shoe_id, price, qty) VALUES($1, $2, $3, $4)",
        [basketId.id, shoeId, price.rows[0].price, 1]
      );
    } else {
      await poo.query(
        "UPDATE shopping_basket_item SET qty = qty + 1 AND price = price * (qty + 1) WHERE shoe_id = $1",
        [shoeId]
      );
    }
  }

  async function getShoppingBaketItems() {
    const shopping_basket = await pool.query(
      "select brand, color, size, price, qty, total FROM shopping_basket_item JOIN shoes ON shopping_basket_item.shoe_id shoes.id JOIN shopping_basket ON shopping_basket_item.basket_id = shopping_basket.id"
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
