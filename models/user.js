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

const plugin =
  passportLocalMongoose && passportLocalMongoose.default
    ? passportLocalMongoose.default
    : passportLocalMongoose

userSchema.plugin(plugin, { usernameField: "userName" })

export const User = mongoose.model("User", userSchema)
