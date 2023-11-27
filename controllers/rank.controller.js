const { default: mongoose } = require('mongoose');
const rank = require('../models/rank.model');

module.exports.addRank = async (req, res) => {
    try {
        const { name, price, num } = req.body;
        const newRank = new rank({
            name,
            price,
            num
        });
        const savedRank = await newRank.save();
        res.status(201).json(savedRank);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

module.exports.get = async (req, res) => {
    try {
        const savedRank = await rank.find();
        res.status(201).json(savedRank);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

//                              //
//-------- MiddleWares----------//
//                              //
module.exports.verifyExists = async (req, res, next) => {
    const { rank_id } = req.body;
    if(rank_id){
        try{
            req.rank_data = await rank.findOne( { _id : rank_id} );
        }
        catch(err){}
    }
    next();
};