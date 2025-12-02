import connectFlash from "connect-flash"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import express from "express"
import layouts from "express-ejs-layouts"
import expressSession from "express-session"
import helmet from "helmet"
import mongoose from "mongoose"
import passport from "passport"
import { imageController } from "./controllers/imageController.js"
import { recipeController } from "./controllers/recipeController.js"
import { usersController } from "./controllers/usersController.js"
import { reviewController } from "./controllers/reviewController.js"
import { isLoggedIn, isNotLoggedIn } from "./middleware/isLoggedIn.js"
import upload from "./middleware/upload.js"
import { User } from "./models/user.js"


dotenv.config()

const app = express()

// Use helmet and allow images from ImageKit
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        imgSrc: ["'self'", "https://ik.imagekit.io"],
      },
    },
  })
)

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

router.use(cookieParser(process.env.SESSION_SECRET))
router.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 4000000 },
    resave: false,
    saveUninitialized: false,
  })
)
router.use(passport.initialize())
router.use(passport.session())

router.use(layouts)
router.use(express.static("public"))

router.use(express.urlencoded({ extended: false }))
router.use(express.json())

router.use(connectFlash())
router.use((req, res, next) => {
  res.locals.loggedIn =
    typeof req.isAuthenticated === "function" ? req.isAuthenticated() : false
  res.locals.currentUser = req.user
  res.locals.flashMessages = req.flash()
  next()
})

// Get currently open path for highlighting the active link on navbar
router.use((req, res, next) => {
  res.locals.activePath = req.path
  next()
})

// Routes
router.get("/", recipeController.showRecipes, imageController.getImages)
router.get("/login", isNotLoggedIn, usersController.login)
router.post("/users/login", usersController.authenticate)
router.get("/register", isNotLoggedIn, usersController.register)
router.get("/logout", isLoggedIn, usersController.logout)
router.post(
  "/users/create",
  usersController.create,
  usersController.redirectView
)
router.get("/recipes/new", isLoggedIn, recipeController.newRecipeForm)
router.get("/recipes/:id", recipeController.showSingleRecipe)
router.post("/recipes", isLoggedIn, upload.single("image"), recipeController.createRecipe)

router.get("/recipes/:id/reviews/new", isLoggedIn, reviewController.newReviewForm)
router.post("/recipes/:id/reviews", isLoggedIn, reviewController.createReview);

app.use("/", router)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
