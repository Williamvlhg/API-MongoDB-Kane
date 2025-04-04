import { MongoClient } from "mongodb";

let db;

export const connectDB = async (uri) => {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db("bibliothèque");
    console.log("MongoDB connecté !");
};

export const getDb = () => db;