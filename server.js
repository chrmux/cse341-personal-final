const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose')
const resolvers = require('./graphql/resolvers/index');
const typeDefs = require('./graphql/schema/index')
require('dotenv').config()
// Define your GraphQL schema using the gql tag
// Create an Apollo Server and start it on a specific port
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('open', () => console.info('Database connected!✨'));
db.on('error', console.error.bind(console, 'MongoDB connection error:😢'));


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
