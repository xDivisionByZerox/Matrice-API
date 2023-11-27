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


module.exports.buy = async (req, res) => {
    if(req.user){
        if(req.rank_data){
            if(req.user_token_data){
                if(req.validate_transaction){

                }
                else{
                    res.status(400).send("Achat refusé : transaction user coins");    
                }
            }
            else{
                res.status(400).send("User don't exists : token");
            }
        }
        else{
            res.status(400).send("Rank don't exists : rank_id");
        }
    }
};

//                              //
//-------- MiddleWares----------//
//                              //
module.exports.verifyExists = async (req, res, next) => {
    const { rank_id } = req.body;
    if(rank_id && mongoose.Types.ObjectId.isValid(rank_id)){
        try{
            req.rank_data = await rank.findOne( { _id : rank_id} );
        }
        catch(err){}
    }
    next();
};