import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: "process.env.CORS_ORIGIN",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static("publc"));
app.use(cookieParser());

// routes import 
import authRouter from "./routes/auth.routes.js";
import mediaRouter from "./routes/media.routes.js";

// routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/media", mediaRouter);


export { app };  