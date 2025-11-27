import dotenv from "dotenv"
import express from "express"
import layouts from "express-ejs-layouts"
import { recipeController } from "./controllers/recipeController.js"

dotenv.config()

const app = express()

// Get port number from the .env-file or default to 3000
const port = process.env.PORT || 3000

app.set("view engine", "ejs")
app.set("port", port)
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static("public"))

app.use(layouts)

app.get("/", (req, res) => {
  res.render("recipes/index")
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
