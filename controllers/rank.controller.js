const { default: mongoose } = require('mongoose');
const rank = require('../models/rank.model');

module.exports.addRank = async (req, res) => {
    try {
        const { name, price } = req.body;
        const newRank = new rank({
            name,
            price
        });
        const savedRank = await newRank.save();
        res.status(201).json(savedRank);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};