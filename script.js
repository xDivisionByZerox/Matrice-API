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


// Récupère une image random a partir d'imgur (a l'aide de l'API imgur)
const getRandomImgurImage = async () => {
  try {
    const response = await axios.get('https://api.imgur.com/3/gallery/random/random/1', {
      headers: {
        Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`, //Utilise API imgur pour récupérer des images random pour les posts
      },
    });

    if (response.data.success && response.data.data && response.data.data.length > 0) {
      const imageUrl = response.data.data[0].link;
      return imageUrl;
    }
  } catch (error) {
    console.error('Error fetching Imgur image:', error.message);
  }

  return null;
};

// Connection a MongoDB, /!\ peut être a corriger /!\
mongoose.connect(process.env.mongodb_url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

//Génère date de naissance random 
  const generateRandomDOB = () => faker.date.between('1980-01-01', '2002-01-01');

  // Génère les 100 utilisateurs
  const users = [];
  const userCredentials = []; // tableau stock les données users
  for (let i = 0; i < 100; i++) {
    const picture = await getRandomImgurImage();
    const user = new UserModel({
      nickname: faker.internet.userName(),
      mail: faker.internet.email(),
      password: faker.internet.password(),
      lastname: faker.name.lastName(),
      firstname: faker.name.firstName(),
      picture: picture,
      bio: faker.lorem.sentence(),
      birthday: generateRandomDOB(),
      rank: null,
      subscribes: 0,
      subscribed: 0,
      coins: 0,
      posts: 0,
      creation: new Date(),
    });

    await user.save();
    users.push(user);

// Stock les combinaisons mail/mdp
    userCredentials.push({ email: user.mail, password: user.password });
  }

 // Nombre de posts pour chaque user
  const generateRandomPosts = () => Math.floor(Math.random() * 10) + 1;

//Génère les 400 posts
  for (const user of users) {
    const numPosts = generateRandomPosts();
    for (let i = 0; i < numPosts; i++) {
      const postPicture = await getRandomImgurImage();
      const post = new PostModel({
        creatorId: user._id,
        ownerId: user._id,
        picture: postPicture,
        description: faker.lorem.sentence(),
        tags: [faker.lorem.word(), faker.lorem.word()],
        likes: 0,
        comments: 0,
        buy: false,
        price: faker.random.number({ min: 5, max: 100 }),
        creation: new Date(),
      });

      await post.save();
      user.posts += 1;
      await user.save();

 // Génère des commentaires pour chaque post
    const numComments = Math.floor(Math.random() * 5); // Nombre de commentaires par post
    for (let k = 0; k < numComments; k++) {
      const commentPicture = await getRandomImgurImage();
      const comment = new PostModel({
        creatorId: users[Math.floor(Math.random() * users.length)]._id, // Choisis un utilisateur aléatoire comme créateur du commentaire
        ownerId: user._id,
        picture: commentPicture,
        description: faker.lorem.sentence(),
        tags: [faker.lorem.word(), faker.lorem.word()],
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
      await user.save();
      followerUser.subscribed += 1;
      await followerUser.save();
    }
  }

  // Génère le fichier user_credentials avec les combo mail/mdp de chaque user
  fs.writeFileSync('user_credentials.txt', userCredentials.map(cred => `${cred.email} - ${cred.password}`).join('\n'));

  console.log('Génération accomplie avec succès.');
  mongoose.connection.close();
});