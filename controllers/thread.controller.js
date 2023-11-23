const thread = require('../models/thread.model');
const post = require('../models/post.model');

module.exports.createThread = async (req, res) => {
    if(req.user){
        if(req.user_token_data){
            if(!req.thread_data){
                try {
                    // TODO : Algo qui va ajouter des posts au thread
                    const t = new thread({ name : req.user_token_data.mail , tags : [] ,posts : []});
                    const savedThread = await t.save();
                    res.status(201).json(savedThread);
                } catch (error) {
                    res.status(500).json({ error: error.message });
                }
            }
            else{
                res.status(400).send("Thread already exists");
            }
        }
        else{
            res.status(400).send("User don't exists : token error");
        }
    }
};

module.exports.deleteThread = async (req, res) => {
    if(req.user){
        if(req.user_token_data){
            if(req.thread_data){
                try {
                    await thread.findByIdAndDelete( req.thread_data._id );
                    res.status(200).json({ message: 'Thread deleted successfully' });
                } catch (error) {
                    res.status(500).json({ error: error.message });
                }
            }
            else{
                res.status(400).send("Thread don't exists");
            }
        }
        else{
            res.status(400).send("User don't exists : token error");
        }
    }
};

module.exports.feedThread = async (req, res) => {
    module.exports.deleteThread = async (req, res) => {
        if(req.user){
            if(req.user_token_data){
                if(req.thread_data){
                    // TODO : Algo qui va ajouter des posts au Thread
                }
                else{
                    res.status(400).send("Thread don't exists");
                }
            }
            else{
                res.status(400).send("User don't exists : token error");
            }
        }
    };
};

//                              //
//-------- MiddleWares----------//
//                              //

// Need req.user_token_data - userController.verifyUserToken
module.exports.verifyExists = async (req, res) => {
    if(req.user && req.user_token_data){
        req.thread_data = await thread.findOne({ name : req.user_token_data.mail });
    }
}