import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { sync } from "../../backend/";
import appRoutes from "../routes/appRoute.ts";

dotenv.config();

const process = process.env.PORT
const host = "localhost";

const app = express();

app.use(cors())
app.use(express.json());

appRoutes(app);

app.listen(port, async()=>{
    if(process.env.SYNC === "true"){
        await sync();
    }
})