"use strict";
/*
 * Laboration 6 - Receptsökaren
 * Namn: Molly Karlsson
 */

// Hämtar element från DOM
const searchForm = document.querySelector("#searchform");
const searchInput = document.querySelector("#search");
const errorMessage = document.querySelector("#error");
const apiMessage = document.querySelector("#message");
const recipeContainer = document.querySelector("#recipe");

let latestSearchId = 0;

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
    `Svårighetsgrad: ${recipe.difficulty}`
  ].forEach((text) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      info.append(paragraph);
  });
  article.append(info)

  const ingredientsTitle = document.createElement("h4");
  ingredientsTitle.textContent = "Ingredienser";
  article.append(ingredientsTitle);

  const ingredientsList = document.createElement("ul");
  recipe.ingredients.forEach((ingredient) => {
    const item = document.createElement("li");
    item.textContent = ingredient;
    ingredientsList.append(item);
  });
  article.append(ingredientsList);

  const instructionsTitle = document.createElement("h4");
  instructionsTitle.textContent = "Instruktioner";
  article.append(instructionsTitle);

  const instructionsList = document.createElement("ol");
  recipe.instructions.forEach((instruction) => {
    const item = document.createElement("li");
    item.textContent = instruction;
    instructionsList.append(item);
  });
  article.append(instructionsList);
  
  recipeContainer.replaceChildren(article);
}


/**
 * Validerar formulärets inmatning
 */
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const searchId = ++latestSearchId;

  recipeContainer.replaceChildren();

  const searchPhrase = searchInput.value.trim();
  if (searchPhrase.length === 0) {
    errorMessage.textContent = "Du måste fylla i en sökfras!";
    searchInput.setAttribute("aria-invalid", "true");
    apiMessage.textContent = "";
    recipeContainer.setAttribute("aria-busy", "false");
    searchInput.focus();
    return;
  }

  errorMessage.textContent = "";
  searchInput.setAttribute("aria-invalid", "false");

  recipeContainer.setAttribute("aria-busy", "true");
  apiMessage.textContent = "Söker efter recept...";


 /**
  * Hämtar recept från API:et
  */
 try {
      const response = await fetch("https://dummyjson.com/recipes");

      if (!response.ok) {
        throw new Error(`API-anropet misslyckades (HTTP ${response.status}).`);
      }
    
      const result = await response.json();

      if (searchId !== latestSearchId) {
        return;
      }

      if (!Array.isArray(result.recipes)) {
        throw new Error("API-svaret innehåller ingen giltig lista med recept.");
      }

      const normalizedSearchPhrase = searchPhrase.toLowerCase();
      const matchingRecipes = result.recipes.filter((recipe) => {
        const searchableText = [
          recipe.name,
          ...(Array.isArray(recipe.ingredients) ? recipe.ingredients : [])
        ].join(" ").toLowerCase();

        return searchableText.includes(normalizedSearchPhrase);
      });

      if (matchingRecipes.length === 0) {
        apiMessage.textContent = `Inga recept hittades för "${searchPhrase}". Prova en annan sökfras.`;
        return;
      }

      displayRecipe(matchingRecipes[0]);
      apiMessage.textContent = "";
 } catch (error) {
    if (searchId !== latestSearchId) {
      return;
    }

    apiMessage.textContent = "Det gick inte att hämta recept. Kontrollera anslutningen och försök igen.";
    console.error("Fel vid API-anrop:", error);
 } finally {
    if (searchId === latestSearchId) {
      recipeContainer.setAttribute("aria-busy", "false");
    }
 }
});
