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
searchForm.addEventListener("submit", async (event) => {
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


 /**
  *Hämtar recept från API:et
  */
  const response = await fetch("https://dummyjson.com/recipes");
  const result = await response.json();

  console.log(result);
});
