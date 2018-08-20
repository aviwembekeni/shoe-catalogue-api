var brandFilterSelect = document.querySelector(".brandFilter");
var sizeFilterSelect = document.querySelector(".sizeFilter");
var searchButton = document.querySelector(".searchButton");
var shoeResultsDisplayElement = document.querySelector(".shoeResultsDisplay");

var brandSelect = document.querySelector(".brand");
var colorSelect = document.querySelector(".color");
var sizeSelect = document.querySelector(".size");
var priceSelect = document.querySelector(".price");
var stockSelect = document.querySelector(".noOfStock");
var addButton = document.querySelector(".addButton");

var shoppingBasketDisplayElem = document.querySelector(
  ".shoppingBasketDisplay"
);

var searchResultsTemplateSource = document.querySelector(
  ".searchResultsTemplate"
).innerHTML;
var searchResultsTemplate = Handlebars.compile(searchResultsTemplateSource);

var shoppingBasketTemplateSource = document.querySelector(
  ".shoppingBasketTemplate"
).innerHTML;
var shoppingBasketTemplate = Handlebars.compile(shoppingBasketTemplateSource);

var clearShoppingBasketButton = document.querySelector(".clearBtn");

var successMessageDivElem = document.querySelector(".successMessageDiv");
var errorMessageDivElem = document.querySelector(".errorMessageDiv");

searchButton.addEventListener("click", handleSearch);
// addButton.addEventListener("click", handleAdd);
// clearShoppingBasketButton.addEventListener("click", handleClearBasket);

//Create ShoeCatalogue instance
var shoeCatalogue = ShoeCatalogue();

// Get all shoes
shoeCatalogue
  .getShoes()
  .then(response => {
    showShoesResults(response.data.shoes);
    if (response.data.shoppingBasketItems.length > 0) {
      showShoppingBasket(response.data.shoppingBasketItems);
    }
  })
  .catch(err => console.log(err));

// Dsiplay shoes function
function showShoesResults(filteredShoes, brand, color, size) {
  filteredShoesData = searchResultsTemplate({
    shoes: filteredShoes
  });

  shoeResultsDisplayElement.innerHTML = filteredShoesData;
}

//Display shopping basket function
function showShoppingBasket(shoppingBasket) {
  var shoppingBasketData = {
    shoes: shoppingBasket,
    totalAmount: shoppingBasket[0].total
  };

  shoppingBasketDisplayElem.innerHTML = shoppingBasketTemplate(
    shoppingBasketData
  );
}

// Add shoe to shopping basket function
function addToBasket(id) {
  shoeCatalogue
    .addShoeToShoppingBasket(id)
    .then(response => console.log(response))
    .catch(err => console.log(err));

  var brand = brandFilterSelect.value;
  var size = sizeFilterSelect.value;

  console.log(brand, size, "brand and size");
  if (brand === "" && size == "") {
    shoeCatalogue.getShoes().then(response => {
      console.log(response, "response");
      showShoesResults(response.data.shoes);
    });
  } else if (brand !== "" && size !== "") {
    shoeCatalogue.getShoesByBrandAndSize(brand, size).then(response => {
      console.log(response, "response");
      showShoesResults(response.data.shoes);
    });
  } else if (brand !== "" && size == "") {
    shoeCatalogue.getShoesByBrand(brand).then(response => {
      showShoesResults(response.data.shoes);
    });
  } else if (brand === "" && size !== "") {
    shoeCatalogue.getShoesBySize(size).then(response => {
      showShoesResults(response.data.shoes);
    });
  }
}

// Filter shoes function

function handleSearch() {
  var brand = brandFilterSelect.value;
  var size = sizeFilterSelect.value;

  if (brand !== "" && size !== "") {
    shoeCatalogue
      .getShoesByBrandAndSize(brand, size)
      .then(response => {
        showShoesResults(response.data.shoes);

        if (response.data.shoppingBasketItems.length > 0) {
          showShoppingBasket(response.data.shoppingBasketItems);
        }
      })
      .catch(err => console.log(err));
  } else if (brand !== "") {
    shoeCatalogue
      .getShoesByBrand(brand)
      .then(response => {
        showShoesResults(response.data.shoes);

        if (response.data.shoppingBasketItems.length > 0) {
          showShoppingBasket(response.data.shoppingBasketItems);
        }
      })
      .catch(err => console.log(err));
  } else if (size !== "") {
    shoeCatalogue
      .getShoesBySize(size)
      .then(response => {
        showShoesResults(response.data.shoes);

        if (response.data.shoppingBasketItems.length > 0) {
          showShoppingBasket(response.data.shoppingBasketItems);
        }
      })
      .catch(err => console.log(err));
  }
}
