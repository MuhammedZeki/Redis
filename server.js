import "dotenv/config"
import { app } from "./app.js";
import { connectMongo } from "./config/mongodb.js";
import { connectRedis } from "./config/redis.js";

const PORT = process.env.PORT || 3000;


await connectMongo();
await connectRedis()


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})