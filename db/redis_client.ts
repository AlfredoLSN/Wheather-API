import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
    try {
        await client.connect();
        console.log("Redis Client connected!");
    } catch (err) {
        console.error("Failed to connect to Redis", err);
    }
})();

export default client;
