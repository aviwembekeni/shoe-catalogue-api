function ShoeCatalogue() {
  async function getShoes() {
    try {
      const response = await axios.get("/api/shoes");
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async function getShoesByBrand(brand) {
    try {
      const response = await axios.get("/api/shoes/brand/" + brand);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async function getShoesBySize(size) {
    try {
      const response = await axios.get("/api/shoes/size/" + size);
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async function getShoesByBrandAndSize(brand, size) {
    try {
      const response = await axios.get(
        "/api/shoes/brand/" + brand + "/size/" + size
      );
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async function addShoeToShoppingBasket(shoeId) {
    try {
      await axios.post("/api/shoes/sold/" + shoeId);
    } catch (error) {
      console.log(error);
    }
  }

  return {
    getShoes,
    getShoesByBrand,
    getShoesBySize,
    getShoesByBrandAndSize,
    addShoeToShoppingBasket
  };
}
