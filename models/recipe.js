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
    required: true,
  },
  steps: {
    type: [String],
    required: true,
  },
  image: {
    type: String
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: {
    type: [String],
  }
},
  { timestamps: true }
)

export const Recipe = mongoose.model("recipe", recipeSchema)
