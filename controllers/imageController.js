import ImageKit from "imagekit";
import dotenv from "dotenv"

dotenv.config()

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUK,
  privateKey: process.env.IMAGEKIT_PRK,
  urlEndpoint: process.env.URL_ENDPOINT
})

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }
    
    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: req.file.originalname
    })

    return res.json({
      url: result.url,
      fileId: result.fileId
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Image upload failed" })
  }
}

export const getImages = async (req, res) => {
  try {
    // Option 1: Get image URLs from database
    // const images = await db.getAllImages(); // e.g., [{url: '...'}, ...]

    // Option 2: Use ImageKit API
    const response = await imagekit.listFiles({ folder: "/uploads/", sort: "desc" });
    const images = response.map(file => file.url);

    // Render EJS template, passing images array
    res.render("images", { images });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load images");
  }
}

export const imageController = {
  uploadImage,
  getImages
}