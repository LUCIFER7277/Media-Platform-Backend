import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { redisCache } from "./utils/redis.js";

dotenv.config({
    path: './.env'
});

connectDB()
    .then(async () => {
        // Initialize Redis connection (optional, graceful fallback if fails)
        await redisCache.connect();

        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️  Server is running at port : ${process.env.PORT || 8000}`);
        });
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    });