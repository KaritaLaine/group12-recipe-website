import { Recipe } from "../models/recipe.js";

const newReviewForm = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId).lean();

    if (!recipe) {
      return res.status(404).send("Recipe not found");
    }
    res.render("reviews/new", { recipe });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load review form");
  }
};

export const reviewController = {
  newReviewForm,
}
