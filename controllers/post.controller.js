const post =  require("../models/post.model");

module.exports.getPost = async(req, res) => {
    const { post_id } = req.body;
    try{
        const data = await post.findOne({ _id: post_id }).exec();
        if(data){
            res.status(200).json(data);
        }
        else{
            res.status(400).send('No post found : post_id');
        }
    }catch(err){
        res.status(500).send('Internal Server Error');
    }
}

module.exports.createPost = async(req, res) => {
    const p = new post(req.body);
    p.creatorId = req.user._id;
    p.ownerId = req.user._id;
    p.save()
        .then(() => {
            res.status(200).send("Posted : success");
        })
        .catch((err) => {
            console.log(err);
            res.status(401).send("Invalid entries");
        });
}

module.exports.buyPost = async(req, res) => {
}

module.exports.enablePost = async(req, res) => {
}

module.exports.disablePost = async(req, res) => {
}

module.exports.commentPost = async(req, res) => {
}