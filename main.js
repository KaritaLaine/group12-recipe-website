import dotenv from "dotenv"
import express from "express"
import layouts from "express-ejs-layouts"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import expressSession from "express-session"
import connectFlash from "connect-flash"
import passport from "passport"
import { usersController } from "./controllers/usersController.js"
import { recipeController } from "./controllers/recipeController.js"
import { imageController } from "./controllers/imageController.js"
import upload from "./middleware/upload.js"
import { User } from "./models/user.js"

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

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(cookieParser(process.env.SESSION_SECRET))
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 4000000 },
    resave: false,
    saveUninitialized: false,
  })
)

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(express.static("public"))
app.use(passport.initialize())
app.use(passport.session())
app.use(connectFlash())
app.use((req, res, next) => {
  res.locals.loggedIn =
    typeof req.isAuthenticated === "function" ? req.isAuthenticated() : false
  res.locals.currentUser = req.user
  res.locals.flashMessages = req.flash()
  next()
})
app.use(layouts)

// Get currently open path for highlighting the active link on navbar
app.use((req, res, next) => {
  res.locals.activePath = req.path
  next()
})

// Routes
router.get("/", recipeController.showRecipes, imageController.getImages)
router.get("/login", usersController.login)
router.post("/users/login", usersController.authenticate)
router.get("/register", usersController.register)
router.post(
  "/users/create",
  usersController.create,
  usersController.redirectView
)
router.get("/recipes/new", recipeController.newRecipeForm)
router.get("/recipes/:id", recipeController.showSingleRecipe)
router.post("/recipes", upload.single("image"), recipeController.createRecipe)

app.use("/", router)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
