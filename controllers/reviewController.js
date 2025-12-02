import { Recipe } from "../models/recipe.js";
import { Review } from "../models/review.js";

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

const createReview = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const { title, review, rating } = req.body;

    const newReview = await Review.create({ title, review, rating });

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).send("Recipe not found");
    }

    recipe.reviews.push(newReview._id);
    await recipe.save();

    res.redirect(`/recipes/${recipeId}`);
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).send("Failed to create review");
  }
};

export const reviewController = {
  newReviewForm,
  createReview
}
