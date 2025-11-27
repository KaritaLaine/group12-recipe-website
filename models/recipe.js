import mongoose from "mongoose"

const recipeSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  timeToCook: {
    type: Number,
    required: true,
    min: 1,
  },
  ingredients: {
    type: [String],
  },
  steps: {
    type: [String],
  },
},
  { timestamps: true }
)

export const Recipe = mongoose.model("recipe", recipeSchema)
