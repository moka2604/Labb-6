"use strict";
/*
 * Laboration 6 - Receptsökaren
 * Namn: Molly Karlsson
 */

//Hämtar element från DOM
const searchForm = document.querySelector("#searchform");
const searchInput = document.querySelector("#search");
const errorMessage = document.querySelector("#error");


/**
*Validerar formulärets inmatning
*/
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const searchPhrase = searchInput.value.trim();
  if (searchPhrase.length === 0) {
    errorMessage.textContent = "Du måste fylla i en sökfras!";
    searchInput.setAttribute("aria-invalid", "true");
    searchInput.focus();
    return;
  }

  errorMessage.textContent = "";
  searchInput.setAttribute("aria-invalid", "false");

  console.log("Sökfras:", searchPhrase);
});
