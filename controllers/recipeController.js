const recipes = [
  {
    title: "Test Recipe",
    ingredients: [
      "Test ingredient1",
      "Test ingredient2"
    ],
    steps: [
      "Test step1",
      "Test step2"
    ]
  }
]

const showRecipes = (req, res) => {
  res.render("recipes/index", { recipes })
}

export const recipeController = {
  showRecipes
}