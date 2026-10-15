"use strict";
/*
 * Laboration 6 - Receptsökaren
 * Namn: Molly Karlsson
 */

// Hämtar element från DOM
const searchForm = document.querySelector("#searchform");
const searchInput = document.querySelector("#search");
const errorMessage = document.querySelector("#error");
const recipeContainer = document.querySelector("#recipe");


/**
 * Skapar och visar ett recept i receptsektionen
 */
function displayRecipe(recipe) {
  const article = document.createElement("article");

  const title = document.createElement("h3");
  title.textContent = recipe.name;
  article.append(title);

  const image = document.createElement("img");
  image.src = recipe.image;
  image.alt = `Bild på ${recipe.name}`;
  article.append(image);

  const info = document.createElement("div");
  info.className = "recipe-info";

  [
    `Portioner: ${recipe.servings}`,
    `Förberedelsetid: ${recipe.prepTimeMinutes} minuter`,
    `Tillagningstid: ${recipe.cookTimeMinutes} minuter`,
    `Svårighetsgard: ${recipe.difficulty}`
    ].forEach((text) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      info.append(paragraph);
    });
  
    article.append(info)
    recipeContainer.replaceChildren(article);
}


/**
 * Validerar formulärets inmatning
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
  * Hämtar recept från API:et
  */
  const response = await fetch("https://dummyjson.com/recipes");
  const result = await response.json();

  const normalizedSearchPhrase = searchPhrase.toLowerCase();
  const matchingRecipes = result.recipes.filter((recipe) => {
    const searchableText = [
      recipe.name,
      ...(Array.isArray(recipe.ingredients) ? recipe.ingredients : [])
    ].join(" ").toLowerCase();

      return searchableText.includes(normalizedSearchPhrase);
  });

  if (matchingRecipes.length > 0) {
    displayRecipe(matchingRecipes[0]);
  }
  
});
