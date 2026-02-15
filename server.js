const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const authRoutes = require("./routes/authRoutes")
const eventRoutes = require("./routes/eventRoutes")

const app = express()
app.use(cors())
app.use(express.json()) // middleware for json parsed


app.use("/api/auth", authRoutes)
app.use("/api/events", eventRoutes)



app.get("/", (request, response) =>{
    response.send("APi is running...")
})

const PORT = process.env.PORT || 5000 

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });