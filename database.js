// Module MySQL
import mysql from 'mysql2'
// Modules MongoDB
import express from 'express'
import mongoose from 'mongoose'
// Module pour les variables d'environnement stocké dans le fichier ".env"
import dotenv from 'dotenv'
dotenv.config()

const mysql_pool = mysql.createPool({
    host: process.env.mysql_host,
    user: process.env.mysql_user,
    password: process.env.mysql_password,
    database: process.env.mysql_database
}).promise()

mongoose.connect(process.env.mongodb_url + process.env.mongodb_user, {})
    .then(result => console.log("Mongo Connected"))
    .catch(err => console.log(err))