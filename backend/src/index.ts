import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import swaggerDoc from "./docs/swagger.json" with { type: "json" };
import { sync } from "./db.ts";
import appRoutes from "./routes/appRoute.ts";

const port = process.env.PORT;
const host = process.env.HOST || "localhost";
const app = express();
const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
    origin: frontendURL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

appRoutes(app);

app.listen(port, async () => {
    if (process.env.SYNC === "true") {
        await sync();
    }
    console.log(`api jookseb aadressil http://${host}:${port}`);
});
