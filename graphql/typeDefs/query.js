const {gql} = require("apollo-server-express");

const query = gql`
  type Query {
    user: User
    car: Car
  }

  type Mutation {
    register(email: String!, password: String!): User
    login(email: String!, password: String!): User
    addCar(
      $name: String!
      $price: Int!
      $imageUrl: String!
      $category: String!
      $description: String!
      $features: String!
      $likes: Int
      $mileages: String
      $rating: Int
      $username: String
    ): Car
    likeCarmutation($_id: ID!, $username: String!): Car
    unlikeCar($_id: ID!, $username: String!): Car
    updateUserCar(
      $_id: ID!
      $name: String!
      $price: Int!
      $imageUrl: String!
      $category: String!
      $description: String!
      $features: String!
      $mileages: String
      $rating: Int
    ): Car
    deleteUserCar($_id: ID!): Car
  }
`;

module.exports = {
    query,
};