const brandFilterSelect = document.querySelector(".brandFilter");
const sizeFilterSelect = document.querySelector(".sizeFilter");
const searchButton = document.querySelector(".searchButton");
const shoeResultsDisplayElement = document.querySelector(".shoeResultsDisplay");

const brandSelect = document.querySelector(".brand");
const colorSelect = document.querySelector(".color");
const sizeSelect = document.querySelector(".size");
const priceSelect = document.querySelector(".price");
const stockSelect = document.querySelector(".noOfStock");
const addButton = document.querySelector(".addButton");

const shoppingBasketDisplayElem = document.querySelector(
  ".shoppingBasketDisplay"
);

const searchResultsTemplateSource = document.querySelector(
  ".searchResultsTemplate"
).innerHTML;
const searchResultsTemplate = Handlebars.compile(searchResultsTemplateSource);

const shoppingBasketTemplateSource = document.querySelector(
  ".shoppingBasketTemplate"
).innerHTML;
const shoppingBasketTemplate = Handlebars.compile(shoppingBasketTemplateSource);

const clearShoppingBasketButton = document.querySelector(".clearBtn");

const successMessageDivElem = document.querySelector(".successMessageDiv");
const errorMessageDivElem = document.querySelector(".errorMessageDiv");

searchButton.addEventListener("click", handleSearch);
addButton.addEventListener("click", handleAdd);
clearShoppingBasketButton.addEventListener("click", handleClearBasket);

//Create ShoeCatalogue instance
const shoeCatalogue = ShoeCatalogue();

// Get all shoes
shoeCatalogue
  .getShoes()
  .then(response => displayUpdatedShoesAndShoppingBakset(response))
  .catch(err => alert(err));

// Dsiplay shoes function
function showShoesResults(filteredShoes) {
  filteredShoesData = searchResultsTemplate({
    shoes: filteredShoes
  });

  shoeResultsDisplayElement.innerHTML = filteredShoesData;
}

//Display shopping basket function
function showShoppingBasket(shoppingBasket) {
  let shoppingBasketData = {
    shoes: shoppingBasket,
    totalAmount: shoppingBasket[0] ? shoppingBasket[0].total : 0
  };

  shoppingBasketDisplayElem.innerHTML = shoppingBasketTemplate(
    shoppingBasketData
  );
}

// Add shoe to shopping basket function
function addToBasket(id) {
  let brand = brandFilterSelect.value;
  let size = sizeFilterSelect.value;

  shoeCatalogue
    .addShoeToShoppingBasket(id)
    .then(response => {
      // a new shoe has been added to the basket

      getUpdatedData(brand, size);
    })
    .catch(err => alert(err));
}

// Filter shoes function

function handleSearch() {
  let brand = brandFilterSelect.value;
  let size = sizeFilterSelect.value;

  getUpdatedData(brand, size);
}

//Get and display updated data

function getUpdatedData(brand, size) {
  if (brand == "all" && size == "all") {
    shoeCatalogue
      .getShoes()
      .then(response => displayUpdatedShoesAndShoppingBakset(response));
  } else if (brand !== "all" && size !== "all") {
    shoeCatalogue
      .getShoesByBrandAndSize(brand, size)
      .then(response => displayUpdatedShoesAndShoppingBakset(response))
      .catch(err => alert(err));
  } else if (brand !== "all") {
    shoeCatalogue
      .getShoesByBrand(brand)
      .then(response => displayUpdatedShoesAndShoppingBakset(response))
      .catch(err => alert(err));
  } else if (size !== "all") {
    shoeCatalogue
      .getShoesBySize(size)
      .then(response => displayUpdatedShoesAndShoppingBakset(response))
      .catch(err => alert(err));
  }
}

// Display shoes and shopping basket

function displayUpdatedShoesAndShoppingBakset(response) {
  showShoesResults(response.data.shoes);

  if (response.data.shoppingBasketItems) {
    showShoppingBasket(response.data.shoppingBasketItems);
  }
}

// add new shoe to stock

function handleAdd() {
  var brand = brandSelect.value;
  var color = colorSelect.value;
  var size = sizeSelect.value;
  var price = priceSelect.value;
  var in_stock = stockSelect.value;

  if (
    brand !== "" &&
    color !== "" &&
    size !== "" &&
    price !== "" &&
    in_stock !== ""
  ) {
    shoeCatalogue
      .addShoe(brand, color, size, price, in_stock)
      .then(response => displayUpdatedShoesAndShoppingBakset(response));

    /*if (shoes !== updatedShoes) {
      successMessageDivElem.style.display = "inline-block";
    } else {
      errorMessageDivElem.style.display = "inline-block";
    }*/
  }

  brandSelect.value = "";
  colorSelect.value = "";
  sizeSelect.value = "";
  priceSelect.value = "";
  stockSelect.value = "";
}

function handleClearBasket() {
  let brand = brandFilterSelect.value;
  let size = sizeFilterSelect.value;

  shoeCatalogue
    .clearShoppingBasket()
    .then(response => {
      getUpdatedData(brand, size);
    })
    .catch(err => alert(err));
}
