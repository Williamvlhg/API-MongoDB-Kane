import { ObjectId } from "mongodb";
import { getDb } from "../utils/db.js";

export const LivreModel = {
    findAll: async (filtre = {}, triOptions = {}) => {
        const db = getDb();
        return db.collection("livres").find(filtre).sort(triOptions).toArray();
    },

    findById: async (id) => {
        const db = getDb();
        return db.collection("livres").findOne({ _id: new ObjectId(id) });
    },

    create: async (livre) => {
        const db = getDb();
        return db.collection("livres").insertOne(livre);
    },

    update: async (id, livre) => {
        const db = getDb();
        return db.collection("livres").updateOne({ _id: new ObjectId(id) }, { $set: livre });
    },

    delete: async (id) => {
        const db = getDb();
        return db.collection("livres").deleteOne({ _id: new ObjectId(id) });
    },
};