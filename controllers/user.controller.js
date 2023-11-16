const bcrypt = require("bcrypt")
const user =  require('../models/user.model.js');

function validateUser(hash) {
    bcrypt
      .compare(password, hash)
      .then(res => {
        return true;
      })
      .catch(err => console.error(err.message))
    return false;
}

module.exports.signup = (req, res) => {
    const u = new user(req.body);
    // Save the user object to the database
    u.save()
        .then(() => {
            res.sendStatus(200);
        })
        .catch((err) => {
            res.sendStatus(400);
        });
}

module.exports.login = async (req, res) => {
    const { mail, password } = req.body;
    try{
        const data = await user.findOne({"mail" : mail}).exec();
        if(data){
            if (await bcrypt.compare(password, data.password)){
                res.status(200).json({"token" : "token Inch'Allah"});
            }
            else{
                res.status(401).send('Invalid password');
            }
        }
        else{
            res.status(401).send('Invalid email');
        }
    }catch(err){
        res.status(500).send('Internal Server Error');
    }
};