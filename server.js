const { ApolloServer, gql } = require('apollo-server');
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


const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
