// Modules MongoDB
const mongoose = require('mongoose');
// Module pour les variables d'environnement stocké dans le fichier ".env"
const dotenv = require('dotenv');
dotenv.config()

mongoose.connect(process.env.mongodb_url, {})
    .then(result => console.log("Mongo Connected"))
    .catch(err => console.log(err))

module.exports = {mongoose};