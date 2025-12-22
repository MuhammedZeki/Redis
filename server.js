import "dotenv/config"
import { app } from "./app.js";
import { connectMongo } from "./config/mongodb.js";
import { connectRedis } from "./config/redis.js";
import { startProductEventSubscriber } from "./subscribers/productEvents.subscriber.js";

const PORT = process.env.PORT || 3000;


await connectMongo();
await connectRedis()
await startProductEventSubscriber();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})