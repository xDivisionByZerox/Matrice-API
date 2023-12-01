require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const faker = require('faker'); //bibliothèque pour générer des données utilisateurs réels
const fs = require('fs');
const UserModel = require('./models/user.model.js');
const PostModel = require('./models/post.model.js');
const LikeModel = require('./models/like.model.js');
const FollowerModel = require('./models/follower.model.js');


// Connection a MongoDB, /!\ peut être a corriger /!\
mongoose.connect(process.env.mongodb_url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');


  const getRandomImgurImage = async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await axios.get(`https://api.imgur.com/3/gallery/random/random/1?timestamp=${timestamp}`, {
        headers: {
          Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
        },
      });

      if (response.data.success && response.data.data && response.data.data.length > 0) {
        const imageData = response.data.data[0];
        const imageUrl = imageData.link;

        // Check if the image has a valid extension
        if (imageData.type && ['image/png', 'image/jpeg', 'image/gif'].includes(imageData.type)) {
          // If it's a valid extension, replace the link with a direct link to the image
          const directLink = imageUrl.replace('https://imgur.com', 'https://i.imgur.com').replace('/a/', '/');

          return directLink + '.png';
        }

        // If it's not a valid extension, try fetching another image
        return getRandomImgurImage();
      }
    } catch (error) {
      console.error('Error fetching Imgur image:', error.message);
    }

    return null;
  };




  //Génère date de naissance random 
  const generateRandomDOB = () => faker.date.between('1980-01-01', '2002-01-01');

  //Génère un mot de passe conforme aux règles
  const generateRandomPassword = () => {
    const minLength = 8;
    const uppercaseRegex = /[A-Z]/;
    const digitRegex = /\d/;

    let password = '';

    while (password.length < minLength || !uppercaseRegex.test(password) || !digitRegex.test(password)) {
      password = faker.internet.password();
    }

    return password;
  };

  // Génère les 100 utilisateurs
  const users = [];
  const userCredentials = []; // tableau stock les données users
  for (let i = 0; i < 400; i++) {
    const picture = await getRandomImgurImage();
    const username = faker.internet.userName().replace(/\./g, '');
    const password = generateRandomPassword();
    const mail = faker.internet.email();

    const user = new UserModel({
      nickname: username,
      mail: mail,
      password: password,
      lastname: faker.name.lastName(),
      firstname: faker.name.firstName(),
      picture: picture,
      bio: faker.lorem.sentence(),
      birthday: generateRandomDOB(),
      subscribes: 0,
      subscribed: 0,
      coins: 0,
      posts: 0,
      creation: new Date(),
    });

    await user.save();
    users.push(user);

    // Stock les combinaisons mail/mdp
    userCredentials.push({ username, mail, password });
  }

  // Ecrit dans le fichier les combos user/password
  fs.writeFile('users_credentials.txt', JSON.stringify(userCredentials), (err) => {
    if (err) throw err;
    console.log('User credentials saved to users_credentials.txt');
  });

  // Liste de 100 tags différents

  const realTags = [
    "vacances", "soleil", "famille", "voyage", "nature", "photographie", "amis", "cuisine", "animaux", "sport",
    "musique", "lecture", "cinéma", "art", "technologie", "mode", "histoire", "science", "éducation", "automobile",
    "voyage", "aventure", "divertissement", "exploration", "célébrités", "humour", "jeux", "fitness", "santé", "alimentation",
    "spiritualité", "design", "anecdotes", "architecture", "finance", "actualités", "écologie", "politique", "religion", "événements",
    "science-fiction", "fantaisie", "histoire", "romance", "humour", "photographie", "technologie", "astronomie", "météo", "jardinage",
    "bricolage", "artisanat", "beauté", "pensées", "motivation", "inspiration", "positivité", "bien-être", "détente", "apprentissage",
    "enseignement", "entrepreneuriat", "succès", "échecs", "rêves", "ambitions", "éthique", "voyages dans le temps", "innovation", "science des données",
    "intelligence artificielle", "robotique", "espace", "océanographie", "archéologie", "psychologie", "philosophie", "biographie", "théâtre", "développement personnel",
    "spiritualité", "minimalisme", "écriture", "poésie", "humour", "comédie", "documentaire", "fiction", "non-fiction", "mystère", "thriller",
    "horreur", "action", "aventure", "comédie romantique", "biopic", "science-fiction", "fantaisie", "drame", "animation", "musical", "historique"
  ];


  // Nombre de posts pour chaque user
  const generateRandomPosts = () => Math.floor(Math.random() * 6) + 1;
  console.log(`Generating ${users.length} posts`);
  // Génère les posts
  for (const user of users) {
    const numPosts = generateRandomPosts();
    console.log(`Generating ${numPosts} posts`);
    for (let i = 0; i < numPosts; i++) {
      const postPicture = await getRandomImgurImage();

      // Génère entre 1 et 3 tags aléatoires
      const numTags = Math.floor(Math.random() * 2) + 1;
      const tags = Array.from({ length: numTags }, () => faker.random.arrayElement(realTags));
      const buy = Math.random() < 0.5;

      const post = new PostModel({
        creatorId: user._id,
        ownerId: user._id,
        picture: postPicture,
        description: faker.lorem.sentence(),
        tags: tags,
        likes: 0,
        comments: 0,
        buy: buy,
        price: 10,
        creation: new Date(),
      });

      await post.save();
      user.posts += 1;

      // Génère des commentaires pour chaque post
      const gennerateRandomComments = () => Math.floor(Math.random() * 6) + 1;
      const numComments = gennerateRandomComments(); // Nombre de commentaires par post
      console.log(`Generating ${numComments} posts`);
      for (let k = 0; k < numComments; k++) {
        const comment = new PostModel({
          creatorId: users[Math.floor(Math.random() * users.length)]._id, // Choisis un utilisateur aléatoire comme créateur du commentaire
          ownerId: user._id,
          picture: null,
          description: faker.lorem.sentence(),
          tags: null,
          likes: 0,
          comments: 0,
          buy: false,
          price: 10,
          creation: new Date(),
          motherId: post._id, // Assigne l'ID du post parent au commentaire
        });

        await comment.save();
        post.comments += 1;
        await post.save();
      }

      // Génère des likes pour chaque post
      const numLikes = Math.floor(Math.random() * users.length) + 1; // likes par posts varient entre 1 et le nombre d'utilisateurs
      const randomUsers = users.slice();
      for (let j = 0; j < numLikes; j++) {
        const randomIndex = Math.floor(Math.random() * randomUsers.length);
        const randomUser = randomUsers.splice(randomIndex, 1)[0];
        const like = new LikeModel({
          userId: randomUser._id,
          postId: post._id,
          creation: new Date(),
        });

        await like.save();
        post.likes += 1;
        await post.save();
      }
    }
  }

  // Génère des liens entre les utilisateurs
  for (const user of users) {
    const numFollowers = Math.floor(Math.random() * users.length);
    const randomUsers = users.slice();
    for (let k = 0; k < numFollowers; k++) {
      const randomIndex = Math.floor(Math.random() * randomUsers.length);
      const followerUser = randomUsers.splice(randomIndex, 1)[0];
      const follower = new FollowerModel({
        userA: user._id,
        userB: followerUser._id,
        creation: new Date(),
      });

      await follower.save();
      user.subscribes += 1;
      followerUser.subscribed += 1;
    }
  }

  console.log('Génération accomplie avec succès.');
  mongoose.connection.close();
});