const {gql} = require("apollo-server-express");

const query = gql`
  type Query {
    user: User
    car: Car
  }

  type Mutation {
    register(email: String!, password: String!): User
    login(email: String!, password: String!): User
  }
`;

module.exports = {
    query,
};