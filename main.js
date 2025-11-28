import dotenv from "dotenv"
import express from "express"
import layouts from "express-ejs-layouts"
import mongoose from "mongoose"
import { usersController } from "./controllers/usersController.js"
import { recipeController } from "./controllers/recipeController.js"
import { imageController } from "./controllers/imageController.js"
import upload from "./middleware/upload.js"

dotenv.config()

const app = express()
const router = express.Router()

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not defined in the .env file")
  process.exit(1)
}

mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message)
    process.exit(1)
  })

// Get port number from the .env-file or default to 3000
const port = process.env.PORT || 3000

app.set("view engine", "ejs")
app.set("port", port)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static("public"))
app.use(layouts)

// Get currently open path for highlighting the active link on navbar
app.use((req, res, next) => {
  res.locals.activePath = req.path
  next()
})

// Routes
router.get("/", recipeController.showRecipes, imageController.getImages)
router.get("/login", usersController.login)
router.get("/register", usersController.register)
router.post("/users/create", usersController.create, usersController.redirectView)
router.get("/recipes/new", recipeController.newRecipeForm)
router.get("/recipes/:id", recipeController.showSingleRecipe)
router.post("/upload", upload.single("image"), imageController.uploadImage)


app.use("/", router)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
