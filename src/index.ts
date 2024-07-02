import express from "express"
import cors from "cors"
import compression from "compression"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import http from "http"
import routes from "./router"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(bodyParser.json());
app.use(cors({credentials:true}));
app.use(compression());
app.use(cookieParser());



app.use("/api/v1/",routes)



// const server =http.createServer(app)

// server.listen(process.env.PORT || 8000, () => {
//     console.log(`Server is running on port ${process.env.PORT || 8000}`)
// })


app.listen(8000, ()=>{
    console.log(`Server is running on port 8000`)
})