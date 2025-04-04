import express from "express";
import { MongoClient, ObjectId } from "mongodb"; // Importation de ObjectId


const app = express();
app.use(express.json());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let db, livres;

async function start() {
    await client.connect();
    console.log("Database connected");
    db = client.db("bibliothèque");
    livres = db.collection("livres");
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
}




app.post("/livres", async (req, res) => {
    try {
        const { titre, auteur, annee, disponible, genres, note, stock, ...rest } = req.body;

        // Validation des champs obligatoires
        if (!titre || !auteur) {
            return res.status(400).json({ message: "Le titre et l'auteur sont obligatoires." });
        }

        // Validation de l'année
        if (typeof annee !== "number" || annee < 1800) {
            return res.status(400).json({ message: "L'année ne peut pas être plus vieux que 1800." });
        }

        // Validation de la disponibilité
        if (typeof disponible !== "boolean") {
            return res.status(400).json({ message: "Le champ 'disponible' doit être un booléen (true / false)." });
        }

        // Validation des genres
        if (!Array.isArray(genres)) {
            return res.status(400).json({ message: "Les genres doivent être écrit entre []." });
        }

        // Validation de la note
        if (typeof note !== "number" || note < 0 || note > 5) {
            return res.status(400).json({ message: "La note doit être un nombre entre 0 et 5." });
        }

        // Validation du stock
        if (typeof stock !== "number" || stock < 0) {
            return res.status(400).json({ message: "Le stock ne peut pas être négatif." });
        }

        // Supprimer tout champ non autorisé, y compris `_id`
        if (rest._id) {
            return res.status(400).json({ message: "Le champ _id ne peut pas être défini manuellement." });
        }

        // Création du nouveau livre
        const newLivre = { titre, auteur, annee, disponible, genres, note, stock };
        await livres.insertOne(newLivre);
        res.status(201).json(newLivre);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du livre.", error: error.message });
    }
});

app.put("/livres/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const updatedLivre = req.body;


        if (typeof updatedLivre.annee !== "number" || updatedLivre.annee < 1800) {
            return res.status(400).json({ message: "L'année ne peut pas être plus vieux que 1800." });
        }

        if (typeof updatedLivre.disponible !== "boolean") {
            return res.status(400).json({ message: "Le champ 'disponible' doit être un booléen (true / false)." });
        }

        if (!Array.isArray(updatedLivre.genres)) {
            return res.status(400).json({ message: "Les genres doivent être écrit entre []." });
        }

        if (typeof updatedLivre.note !== "number" || updatedLivre.note < 0 || updatedLivre.note > 5) {
            return res.status(400).json({ message: "La note doit être un nombre entre 0 et 5." });
        }

        if (typeof updatedLivre.stock !== "number" || updatedLivre.stock < 0) {
            return res.status(400).json({ message: "Le stock ne peut pas être négatif." });
        }

        if (updatedLivre._id) {
            return res.status(400).json({ message: "Le champ _id ne peut pas être défini manuellement." });
        }
        await livres.updateOne({ _id: new ObjectId(id) }, { $set: updatedLivre });
        res.status(200).json(updatedLivre);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete("/livres/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await livres.deleteOne({ _id: new ObjectId(id) });
        res.status(200).json({ message: "Livre supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);

app.get("/livres/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const livre = await livres.findOne({ _id: new ObjectId(id) });
        if (!livre) {
            return res.status(404).json({ message: "Le livre n'a pas été trouvé" });
        }
        res.status(200).json(livre);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
);


app.get("/livres/", async (req, res) => {
    try {
        const { auteur, disponible, genre, minNote, tri, ordre } = req.query;

        // Construire le filtre
        const filtre = {};
        if (auteur) {
            filtre.auteur = auteur;
        }
        if (disponible) {
            filtre.disponible = disponible === "true"; // Convertir en booléen
        }
        if (genre) {
            filtre.genres = genre; // Vérifie si le genre est dans le tableau `genres`
        }
        if (minNote) {
            filtre.note = { $gte: parseFloat(minNote) }; // Note minimum
        }

        // Construire le tri
        const triOptions = {};
        if (tri) {
            const ordreTri = ordre === "desc" ? -1 : 1; // Tri ascendant ou descendant
            triOptions[tri] = ordreTri;
        }

        // Récupérer les livres avec filtres et tri
        const livresList = await livres.find(filtre).sort(triOptions).toArray();

        if (livresList.length === 0) {
            return res.status(404).json({ message: "Aucun livre trouvé avec les critères spécifiés." });
        }

        res.status(200).json(livresList);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des livres.", error: error.message });
    }
});

start();