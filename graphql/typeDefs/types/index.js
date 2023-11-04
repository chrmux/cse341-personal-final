const { gql } = require("apollo-server-express");

const userType = gql`
  type User {
    email: String!
    password: String!
    token: String
    confirmed: String
    image: String
  }
  
  type Car{
    name: String!
      price: Int!
      imageUrl: String!
      category: String!
      description: String!
      features: String!
      likes: Int
      mileages: String
      rating: Int
      username: String
  }
`
module.exports = {
  userType,
};