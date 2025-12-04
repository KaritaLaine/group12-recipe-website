import mongoose from "mongoose"

const reviewSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
})

export const Review = mongoose.model("review", reviewSchema)
