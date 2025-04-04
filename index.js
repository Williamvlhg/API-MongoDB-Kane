import express from "express";
import router from "./src/routes/livresRoutes.js";
import { connectDB } from "./src/utils/db.js";

const app = express();
app.use(express.json());

const uri = "mongodb://localhost:27017";

connectDB(uri).then(() => {
    app.use("/livres", router);

    app.listen(3000, () => {
        console.log("Serveur lancé sur le port 3000");
    });
});