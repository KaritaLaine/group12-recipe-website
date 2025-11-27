import mongoose from "mongoose"

const recipeSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  ingredients: {
    type: [String],
  },
  steps: {
    type: [String],
  },
})

export const Recipe = mongoose.model("recipe", recipeSchema)
