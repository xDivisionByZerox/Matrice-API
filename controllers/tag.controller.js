const tag = require('../models/tag.model');

//-----Middleswares-----//
module.exports.createTags = async(req, res, next) => {
    const { tags } = req.body;
    if(tags) {
        tags.forEach(element => {
            t = new tag({ name : element , quantity : 1 })
            t.save()
            .then(() => {
                
            })
            .catch((err) => {
                tag.findOneAndUpdate({name : element}, {$inc : {quantity : 1}}).exec();
            });
        });
    }
    next()
}