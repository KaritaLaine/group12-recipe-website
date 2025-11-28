import ImageKit from "imagekit"
import dotenv from "dotenv"

dotenv.config()

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUK,
  privateKey: process.env.IMAGEKIT_PRK,
  urlEndpoint: process.env.URL_ENDPOINT
})

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
  getImages
}
