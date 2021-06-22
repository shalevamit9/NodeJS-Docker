const express = require('express');
const { json: jsonParser, urlencoded: urlencodedParser } = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const redis = require('redis');

const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URI,
  REDIS_PORT,
  SESSION_SECRET
} = require('./config/config');

// Redis store and client
let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient({
  host: REDIS_URI,
  port: REDIS_PORT
});

const app = express();

// Parsing middlewares
app.use(jsonParser());
app.use(urlencodedParser({ extended: true }));

// Session middlewares
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: SESSION_SECRET,
  cookie: {
    httpOnly: true, // true will disable client side javascript the access to the cookie
    secure: false, // true will enable the cookie only for HTTPS
    maxAge: 30000 // the time that the cookie will live in ms. in a production env maxAge need to be higher, maybe a couple of hours
  },
  resave: false,
  saveUninitialized: false,
  rolling: true
}));

app.use('/', (req, res, next) => {
  if (req.session) {
    console.log(req.session);
  }

  next();
})

// Routes
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);

const PORT = process.env.PORT || 3000;

/* startServer function with async await syntax */
// wrap in a function to ensure connection to db has been established
const startServer = async () => {
  try {
    // in the uri we pass the value 'mongo' (MONGO_IP) instead of an ip-address.
    // this is valid because of the network job docker-compose does behind the scenes.
    // docker-compose creates a network of its own and can act as a DNS
    // for the services it supervises, so instead of checking what is the ip-address
    // of the mongo container, you can just type the name of the service in the docker-compose file
    await mongoose.connect(
      `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/mydb?authSource=admin`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      }
    );

    console.log('Connected to DB');
  } catch (e) {
    console.log(e);

    // set a timeout to startServer again if the connection to mongo db failed
    // to retry the connection
    return setTimeout(startServer, 5000);
  }

  app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
};

startServer();

/* startServer function with then catch syntax */
// // wrap in a function to ensure connection to db has been established
// const startServer = () => {
//   // in the uri we pass the value 'mongo' (MONGO_IP) instead of an ip-address.
//   // this is valid because of the network job docker-compose does behind the scenes.
//   // docker-compose creates a network of its own and can act as a DNS
//   // for the services it supervises, so instead of checking what is the ip-address
//   // of the mongo container, you can just type the name of the service in the docker-compose file
//   mongoose.connect(
//     `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/mydb?authSource=admin`,
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     }
//   ).then(() => {
//     console.log('successfully connected to DB');
//     app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
//   }).catch(err => {
//     console.error(err);

//     // set a timeout to startServer again if the connection to mongo db failed
//     // to retry the connection
//     setTimeout(startServer, 5000);
//   });
// };
