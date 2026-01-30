import express from "express"
import "dotenv/config"
import cors from "cors"

import connectDB from "./config/mongodb.js"
import userRouter from "./routes/userRoute.js"
import imageRouter from "./routes/imageRoutes.js"


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())

await connectDB()

app.use("/api/user", userRouter)
app.use("/api/image", imageRouter)

app.get("/", (req, res) => {
    res.send("Homeee")
})


const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log("serveris running");
})