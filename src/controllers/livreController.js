import { LivreModel } from "../models/livreModel.js";

export const getLivres = async (req, res) => {
    const { auteur, disponible, genre, minNote, tri, ordre } = req.query;
    const filtre = {};

    if (auteur) filtre.auteur = auteur;
    if (disponible) filtre.disponible = disponible === "true";
    if (genre) filtre.genres = genre;
    if (minNote) filtre.note = { $gte: parseFloat(minNote) };

    const triOptions = {};
    if (tri) triOptions[tri] = ordre === "desc" ? -1 : 1;

    try {
        const livres = await LivreModel.findAll(filtre, triOptions);
        if (livres.length === 0)
            return res.status(404).json({ message: "Aucun livre trouvé." });
        res.status(200).json(livres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getLivreById = async (req, res) => {
    try {
        const livre = await LivreModel.findById(req.params.id);
        if (!livre)
            return res.status(404).json({ message: "Livre non trouvé." });
        res.status(200).json(livre);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createLivre = async (req, res) => {
    const { titre, auteur, annee, disponible, genres, note, stock, ...rest } = req.body;

    if (!titre || !auteur)
        return res.status(400).json({ message: "Titre et auteur requis." });

    if (typeof annee !== "number" || annee < 1800)
        return res.status(400).json({ message: "Année invalide." });

    if (typeof disponible !== "boolean")
        return res.status(400).json({ message: "Disponibilité invalide." });

    if (!Array.isArray(genres))
        return res.status(400).json({ message: "Genres invalides." });

    if (typeof note !== "number" || note < 0 || note > 5)
        return res.status(400).json({ message: "Note invalide." });

    if (typeof stock !== "number" || stock < 0)
        return res.status(400).json({ message: "Stock invalide." });

    if (rest._id)
        return res.status(400).json({ message: "ID non autorisé." });

    try {
        const newLivre = { titre, auteur, annee, disponible, genres, note, stock };
        await LivreModel.create(newLivre);
        res.status(201).json(newLivre);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateLivre = async (req, res) => {
    const { id } = req.params;
    const livre = req.body;

    if (livre._id)
        return res.status(400).json({ message: "ID non modifiable." });

    try {
        await LivreModel.update(id, livre);
        res.status(200).json(livre);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteLivre = async (req, res) => {
    try {
        await LivreModel.delete(req.params.id);
        res.status(200).json({ message: "Livre supprimé." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};