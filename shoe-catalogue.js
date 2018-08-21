module.exports = function(pool) {
  async function addShoe(brand, color, size, price, in_stock) {
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
    const shoes = await pool.query("SELECT * FROM shoes ORDER BY id ASC");
    return shoes.rows;
  }

  async function getShoesByBrand(brand) {
    const filteredShoes = await pool.query(
      "SELECT * FROM shoes WHERE brand = $1 ORDER BY id ASC",
      [brand]
    );
    return filteredShoes.rows;
  }

  async function getShoesBySize(size) {
    const filteredShoes = await pool.query(
      "SELECT * FROM shoes WHERE size = $1 ORDER BY id ASC",
      [size]
    );
    return filteredShoes.rows;
  }

  async function getShoesByBrandAndSize(brand, size) {
    const filteredShoes = await pool.query(
      "SELECT * FROM shoes WHERE brand = $1 AND size = $2 ORDER BY id ASC",
      [brand, size]
    );
    return filteredShoes.rows;
  }

  async function buyShoe(shoeId) {
    let shoes = await pool.query(
      "SELECT * from shoes WHERE id = $1 AND in_stock > 0",
      [shoeId]
    );

    if (shoes.rowCount > 0) {
      await pool.query(
        "UPDATE shoes SET in_stock = in_stock - 1 WHERE id = $1 AND in_stock > 0",
        [shoeId]
      );

      addShoeToShoppingBasket(shoeId);
    }
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
      console.log(price, "insert");
      await pool.query(
        "INSERT INTO shopping_basket_item(basket_id, shoe_id, shoe_price, total_price, qty) VALUES($1, $2, $3, $4, $5)",
        [basketId, shoeId, price, price, 1]
      );
    } else {
      console.log("update");
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
      "SELECT brand, color, size,qty, shoe_price, total_price, total from shopping_basket_item JOIN shoes ON shopping_basket_item.shoe_id = shoes.id JOIN shopping_basket ON shopping_basket.id = shopping_basket_item.basket_id ORDER BY shopping_basket_item.id ASC"
    );

    return shopping_basket.rows;
  }

  async function getShoppingBaket() {
    const shopping_basket = await pool.query("select * from shopping_basket");
    return shopping_basket.rows;
  }

  async function clearShoppingBasket() {
    let items = await pool.query("SELECT * FROM shopping_basket_item");
    if (items.rowCount > 0) {
      let itemList = items.rows;
      for (const item of itemList) {
        let qty = item.qty;
        await pool.query(
          "UPDATE shoes SET quantity=(quantity+$1) Where id=${item.shoe_id}",
          [qty]
        );
      }
      await pool.query("DELETE FROM shopping_basket_item");
      await pool.query("UPDATE shopping_basket set total = 0");
      return true;
    } else {
      return "shopping cart is empty!!!";
    }
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
    getShoppingBaketItems,
    clearShoppingBasket
  };
};
