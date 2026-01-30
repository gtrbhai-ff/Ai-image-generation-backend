import axios from "axios"
import FormData from "form-data"
import userModel from "../models/Usermodel.js"

export const generateImage = async (req, res) => {
  try {
    const userId = req.userId
    const { prompt } = req.body

    // 1️⃣ Validate input
    if (!userId || !prompt) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or prompt",
      })
    }

    // 2️⃣ Find user (still REQUIRED)
    const user = await userModel.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // 🚀 UNLIMITED: No credit check

    // 3️⃣ Prepare Clipdrop request
    const formData = new FormData()
    formData.append("prompt", prompt)

    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API_KEY,
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer",
        timeout: 20000,
      }
    )

    // 4️⃣ Convert image
    const base64Image = Buffer.from(response.data).toString("base64")
    const resultImage = `data:image/png;base64,${base64Image}`

    // 🚀 UNLIMITED: No credit deduction

    // 5️⃣ Send success response
    return res.status(200).json({
      success: true,
      message: "Image generated successfully",
      resultImage,
    })

  } catch (error) {
    console.error("Generate Image Error:", error.message)

    if (error.code === "ENOTFOUND") {
      return res.status(503).json({
        success: false,
        message: "Clipdrop service unreachable (DNS / Network issue)",
      })
    }

    return res.status(500).json({
      success: false,
      message: "Image generation failed",
    })
  }
}
