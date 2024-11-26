require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const securePassword = require('secure-random-password');
const UserModel = require('./models/user.model.js');
const PostModel = require('./models/post.model.js');
const LikeModel = require('./models/like.model.js');
const FollowerModel = require('./models/follower.model.js');

// Connection à MongoDB
mongoose.connect(process.env.mongodb_url, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  const getRandomImgurImage = async (retryCount = 10) => {
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
        if (retryCount > 0) {
          // Add a small delay before retrying
          await new Promise(resolve => setTimeout(resolve, 100));
          return getRandomImgurImage(retryCount - 1);
        }
      }
    } catch (error) {
      console.error('Error fetching Imgur image:', error.message);
    }

    return null;
  };

  const generateRandomDOB = () => faker.date.between({ from: '1980-01-01', to: '2002-01-01' });

  const generateRandomPassword = () => {
    const passwordOptions = {
      length: 10,
      characters: securePassword.lower + securePassword.upper + securePassword.digits,
    };

    let password = securePassword.randomPassword(passwordOptions);

    const digit = securePassword.digits.charAt(Math.floor(Math.random() * securePassword.digits.length));
    const randomIndex = Math.floor(Math.random() * password.length);
    password = password.substring(0, randomIndex) + digit + password.substring(randomIndex + 1);

    return password;
  };

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

  // Génère les utilisateurs avec centres d'intérêt
  const users = [];
  const userCredentials = [];
  const nbUserGeneration = 100;
  console.log(`Generating ${nbUserGeneration} users`);
  for (let i = 0; i < nbUserGeneration; i++) {
    const picture = await getRandomImgurImage();
    const username = faker.internet.userName().replace(/\./g, '');
    const password = generateRandomPassword();
    const email = faker.internet.email();

    const interests = faker.helpers.arrayElements(realTags, 2);
    interests.push("musique");

    const user = new UserModel({
      nickname: username,
      mail: email,
      password: password,
      lastname: faker.person.lastName(),
      firstname: faker.person.firstName(),
      picture: picture,
      bio: faker.lorem.sentence(),
      birthday: generateRandomDOB(),
      subscribes: 0,
      subscribed: 0,
      coins: 0,
      posts: 0,
      interests: interests,
      creation: new Date(),
    });

    await user.save();
    users.push(user);
    console.log(`Generated ${user.nickname} account`);
    userCredentials.push({ email, password });
  }

  fs.writeFile('users_credentials.json', JSON.stringify(userCredentials, null, 2), (err) => {
    if (err) throw err;
    console.log('User credentials saved to users_credentials.json');
  });

  // Génère les posts
  const posts = [];
  const generateRandomPosts = () => Math.floor(Math.random() * 6) + 1;
  console.log(`Generating ${users.length} posts`);
  for (const user of users) {
    const numPosts = generateRandomPosts();
    console.log(`Generating ${numPosts} posts for user ${user.nickname}`);
    for (let i = 0; i < numPosts; i++) {
      const postPicture = await getRandomImgurImage();
      const numTags = Math.floor(Math.random() * 2) + 1;
      const tags = Array.from({ length: numTags }, () => faker.helpers.arrayElement(realTags));
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
      posts.push(post);
      user.posts += 1;
      await user.save();

      const gennerateRandomComments = () => Math.floor(Math.random() * 2) + 1;
      const numComments = gennerateRandomComments();
      console.log(`Generating ${numComments} comments for post ${post._id}`);
      for (let k = 0; k < numComments; k++) {
        const comment = new PostModel({
          creatorId: users[Math.floor(Math.random() * users.length)]._id,
          ownerId: user._id,
          picture: null,
          description: faker.lorem.sentence(),
          tags: null,
          likes: 0,
          comments: 0,
          buy: false,
          price: 10,
          creation: new Date(),
          motherId: post._id,
        });

        await comment.save();
        post.comments += 1;
        await post.save();
      }

      const numLikes = Math.floor(Math.random() * users.length) + 1;
      const randomUsers = users.slice();
      for (let j = 0; j < numLikes; j++) {
        const randomIndex = Math.floor(Math.random() * randomUsers.length);
        const randomUser = randomUsers.splice(randomIndex, 1)[0];
        const like = new LikeModel({
          userId: randomUser._id,
          postId: post._id,
          creation: new Date(),
        });

        if (post.tags.some(tag => randomUser.interests.includes(tag))) {
          await like.save();
          post.likes += 1;
          await post.save();
        }
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

  console.log('Generation completed successfully.');
  mongoose.connection.close();
});