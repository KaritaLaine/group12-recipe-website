const ingredients = [];
const steps = [];

const ingredientInput = document.getElementById("ingredientInput");
const addIngredientBtn = document.getElementById("addIngredientBtn");
const ingredientsList = document.getElementById("ingredientsList");
const ingredientsTextarea = document.getElementById("ingredientsTextarea");

const stepInput = document.getElementById("stepInput");
const addStepBtn = document.getElementById("addStepBtn");
const stepsList = document.getElementById("stepsList");
const stepsTextarea = document.getElementById("stepsTextarea");

function syncHiddenFields() {
  ingredientsTextarea.value = ingredients.join("\n");
  stepsTextarea.value = steps.join("\n");
}

function renderIngredients() {
  ingredientsList.innerHTML = "";
  ingredients.forEach((item, idx) => {
    const li = document.createElement("li");
    li.classList.add("list-item");
    li.textContent = item + " ";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "-";
    removeBtn.classList.add("list-btn");
    removeBtn.addEventListener("click", () => {
      ingredients.splice(idx, 1);
      renderIngredients();
      syncHiddenFields();
    });

    li.appendChild(removeBtn);
    ingredientsList.appendChild(li);
  });
}

function renderSteps() {
  stepsList.innerHTML = "";
  steps.forEach((item, idx) => {
    const li = document.createElement("li");
    li.classList.add("list-item"); 
    li.textContent = item + " ";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "-";
    removeBtn.classList.add("list-btn");
    removeBtn.addEventListener("click", () => {
      steps.splice(idx, 1);
      renderSteps();
      syncHiddenFields();
    });

    li.appendChild(removeBtn);
    stepsList.appendChild(li);
  });
}

addIngredientBtn.addEventListener("click", () => {
  const value = ingredientInput.value.trim();
  if (!value) return;

  ingredients.push(value);
  ingredientInput.value = "";
  renderIngredients();
  syncHiddenFields();
});

addStepBtn.addEventListener("click", () => {
  const value = stepInput.value.trim();
  if (!value) return;

  steps.push(value);
  stepInput.value = "";
  renderSteps();
  syncHiddenFields();
});

ingredientInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addIngredientBtn.click();
  }
});

stepInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addStepBtn.click();
  }
});
