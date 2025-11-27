import dotenv from "dotenv"
import express from "express"
import layouts from "express-ejs-layouts"
import { recipeController } from "./controllers/recipeController.js"
import mongoose from "mongoose"
import { usersController } from "./controllers/usersController.js"
import multer from "multer"
import path from "path"

dotenv.config()

const app = express()

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname)
    cb(null, unique + ext)
  },
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) cb(null, true)
  else cb(new Error("Only image files allowed"), false)
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
})

// Get currently open path for highlighting the active link on navbar
app.use((req, res, next) => {
  res.locals.activePath = req.path
  next()
})

app.use(layouts)

app.get("/", recipeController.showRecipes)
app.get("/recipes/new", recipeController.newRecipeForm)
app.post("/recipes", upload.single("image"), recipeController.createRecipe)
app.get("/recipes/:id", recipeController.showRecipe)

app.get("/login", (req, res) => {
  res.render("users/login")
})

app.get("/register", (req, res) => {
  res.render("users/register")
})

app.post("/users/create", usersController.create, usersController.redirectView)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
