import express from "express";
import cors from 'cors';
import routes from "./config/routes.js";
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    // allowedHeaders: ["Content-Type", "Authorization"] => belum butuh
}))

app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(routes)

app.listen(8080, () => {
    console.log("Server running on port 8080")
})