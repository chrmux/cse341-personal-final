const { ApolloServer } = require('@apollo/server')
const mongoose = require('mongoose')
const Auth = require('./services/auth.service')
const typeDefs = require('./graphql/schema/index')
const resolvers = require('./graphql/resolvers/index')
const { startStandaloneServer } = require("@apollo/server/standalone");


mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true }
)

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: req => {
    return {
      ...req,
      userId:
        req
          ? Auth.getUserId({req})
          : null
    };
  }
})


const dev_db_url = 'mongodb://localhost:27017/car';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('open', () => console.info('Database connected!✨'));
db.on('error', console.error.bind(console, 'MongoDB connection error:😢'));


startStandaloneServer(server, {
  listen: { port: 8080 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});