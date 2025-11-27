import dotenv from "dotenv"
import express from "express"
import layouts from "express-ejs-layouts"
import mongoose from "mongoose"
import { usersController } from "./controllers/usersController.js"
import { recipeController } from "./controllers/recipeController.js"
import multer from "multer"
import path from "path"

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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true)
    else cb(new Error("Only image files allowed"), false)
  },
})

// Routes
router.get("/", recipeController.showRecipes)
router.get("/login", usersController.login)
router.get("/register", usersController.register)
router.post("/users/create", usersController.create, usersController.redirectView)
router.get("/recipes/new", recipeController.newRecipeForm)
router.get("/recipes/:id", recipeController.showSingleRecipe)

router.post(
  "/recipes",
  upload.single("image"),
  (req, res, next) => {
    if (!req.file) return next()

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "recipeImages",
    })

    const ext = path.extname(req.file.originalname)
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`

    const uploadStream = bucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
    })

    uploadStream.end(req.file.buffer)

    uploadStream.on("finish", () => {
      req.gridfsFilename = filename
      next()
    })

    uploadStream.on("error", next)
  },
  recipeController.createRecipe
)

router.get("/images/:filename", (req, res) => {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "recipeImages",
  })

  bucket
    .openDownloadStreamByName(req.params.filename)
    .on("error", () => res.status(404).send("Image not found"))
    .pipe(res)
})

app.use("/", router)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
