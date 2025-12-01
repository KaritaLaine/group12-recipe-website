import mongoose from "mongoose"
import passportLocalMongoose from "passport-local-mongoose"

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
})

userSchema.plugin(passportLocalMongoose, { usernameField: "userName" })

export const User = mongoose.model("User", userSchema)
