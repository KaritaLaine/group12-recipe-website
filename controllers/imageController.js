import ImageKit from "imagekit"
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
      fileName: `${Date.now()}-${req.file.originalname}`,
      folder: "/uploads",
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
    const response = await imagekit.listFiles({
      folderPath: "/uploads",
      sort: "DESC_CREATED"
    })

    const images = response.map(file => file.url)

    res.render("images", { images })
  } catch (err) {
    console.error(err)
    res.status(500).send("Failed to load images")
  }
}

export const imageController = {
  uploadImage,
  getImages
}
