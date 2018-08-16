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

// searchButton.addEventListener("click", handleSearch);
// addButton.addEventListener("click", handleAdd);
// clearShoppingBasketButton.addEventListener("click", handleClearBasket);

var shoeCatalogue = ShoeCatalogue();

shoeCatalogue
  .getShoes()
  .then(response => {
    showShoesResults(response.data);
  })
  .catch(err => console.log(err));

function showShoesResults(filteredShoes, brand, color, size) {
  console.log(filteredShoes);

  if (filteredShoes.length !== 0) {
    filteredShoesData = searchResultsTemplate({
      shoes: filteredShoes
    });

    shoeResultsDisplayElement.innerHTML = filteredShoesData;
  } else {
    if (brand !== undefined) {
      filteredShoesData = searchResultsTemplate({
        shoes: [
          {
            in_stock: 0,
            brand: brand,
            color: color,
            size: size
          }
        ]
      });

      shoeResultsDisplayElement.innerHTML = filteredShoesData;
    }
  }
}

function addToBasket(id) {
  shoeCatalogue.addShoeToShoppingBasket(id);
  // var shoppingBasket = shoeCatalogue.getShoppingBasket();

  var updatedShoes = shoeCatalogue.getShoes().then(response => {
    console.log(response.data);
    showShoesResults(
      updatedShoes.data
      // updatedShoes.brand,
      // updatedShoes.color,
      // updatedShoes.size
    );
  });

  // showShoppingBasket(shoppingBasket);
}
