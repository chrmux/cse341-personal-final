const { gql } = require('apollo-server-express');


const typeDefs = gql`
type User {
  id: ID!
  email: String!
  username: String!
  password: String!
  joinDate: String
  favorites: [Car]
}


  input UserInput {
    username: String
    email: String
    # Add other fields you want to update
  }
  
type Token {
  jwt: ID!
}
type Car {
  _id: ID
  name: String!
  price: Int!
  imageUrl: String!
  category: String!
  description: String!
  features: String!
  createdDate: String
  likes: Int
  username: String
  mileages: String
  rating: Int
  owner: User
}

type Query {
  getUser(id: ID!): User
  getUsers: [User]

  getAllCars: [Car]
  getCar(_id: ID!): Car
  searchCars(searchTerm: String): [Car]
    
  getUserCars(username: String!): [Car]

}
type Mutation {
  signup(email: String!, username: String!, password: String!): String!,
  login(email: String, username: String, password: String!): Token!,

  updateUser(id: ID!, input: UserInput!): User
  deleteUser(id: ID!): User

  addCar(
    name: String!,
    price: Int!,
    imageUrl: String!,
    category: String!,
    description: String!,
    features: String!,
    likes: Int,
    mileages: String,
    rating: Int,
    username: String
    ): Car
    deleteItem(id: ID!): Car

    deleteUserCar(_id: ID): Car
    
    updateUserCar(
    _id: ID!,
    name: String!,
    price: Int!,
    imageUrl: String!,
    category: String!,
    description: String!,
    features: String!,
    mileages: String,
    rating: Int
    ): Car

    likeCar(_id: ID!, username: String!): Car
    unlikeCar(_id: ID!, username: String!): Car
}`;

module.exports = typeDefs