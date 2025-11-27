import { Recipe } from "../models/recipe.js"

const showRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().lean()
    res.render("recipes/index", { recipes })
  } catch (err) {
    console.error(err)
    res.status(500).send("Failed to load recipes")
  }
}

const showRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).lean()
    if (!recipe) return res.status(404).send("Recipe not found")
    res.render("recipes/show", { recipe })
  } catch (err) {
    console.error(err)
    res.status(500).send("Failed to load recipe")
  }
}

const newRecipeForm = (req, res) => {
  res.render("recipes/new")
}

const createRecipe = async (req, res) => {
  try {
    const { title, timeToCook, ingredients, steps } = req.body

    const ingredientsArr = ingredients
      ? ingredients.split("\n").map(s => s.trim()).filter(Boolean)
      : []

    const stepsArr = steps
      ? steps.split("\n").map(s => s.trim()).filter(Boolean)
      : []

    await Recipe.create({
      title: title.trim(),
      timeToCook: Number(timeToCook),
      ingredients: ingredientsArr,
      steps: stepsArr,
      image: req.gridfsFilename || undefined
    })

    res.redirect("/")
  } catch (err) {
    console.error(err)
    res.status(400).send("Failed to create recipe")
  }
}

export const recipeController = {
  showRecipes,
  showRecipe,
  newRecipeForm,
  createRecipe,
}
