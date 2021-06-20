const express = require('express');
const { json: jsonParser, urlencoded: urlencodedParser } = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require('./routes/post');
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require('./config/config');

const app = express();

// Parsing middlewares
app.use(jsonParser());
app.use(urlencodedParser({ extended: true }));

// Routes
app.use('/api/v1/posts', postRoutes);

const PORT = process.env.PORT || 3000;

// wrap in a function to ensure connection to db has been established
const startServer = () => {
  // in the uri we pass the value 'mongo' (MONGO_IP) instead of an ip-address.
  // this is valid because of the network job docker-compose does behind the scenes.
  // docker-compose creates a network of its own and can act as a DNS
  // for the services it supervises, so instead of checking what is the ip-address
  // of the mongo container, you can just type the name of the service in the docker-compose file
  mongoose.connect(
    `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/mydb?authSource=admin`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  ).then(() => {
    console.log('successfully connected to DB');
    app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
  }).catch(err => {
    console.error(err);

    // set a timeout to startServer again if the connection to mongo db failed
    // to retry the connection
    setTimeout(startServer, 5000);
  });
};

startServer();
