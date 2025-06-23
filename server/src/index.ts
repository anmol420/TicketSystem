import * as mongoose from "mongoose";

import app from "./app";

mongoose
    .connect(`${Bun.env.MONGO_URI}/ticketing-system`)
    .then(() => {
        console.log("Connected to MongoDB");
        Bun.serve({
            fetch: app.fetch,
            port: Bun.env.PORT,
        });
        console.log(`Server is running on port ${Bun.env.PORT}`);
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });