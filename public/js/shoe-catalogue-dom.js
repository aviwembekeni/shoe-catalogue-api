const axios = require("axios");

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
addButton.addEventListener("click", handleAdd);
clearShoppingBasketButton.addEventListener("click", handleClearBasket);
