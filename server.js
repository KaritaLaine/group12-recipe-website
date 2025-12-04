import app from "./main.js"

// Get port number from the .env-file or default to 3000
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
