const bcrypt = require('bcrypt');
const {getToken} = require('../../utils/jwt');
const UserModel = require('../../models/userModel');
const CarModel = require('../../models/car');

const {AuthenticationError} = require('apollo-server-express');

const resolvers = {
    Query: {
        user: (parent, args, context, info) => {
            if (context.loggedIn) {
                console.log(context.user)
                return context.user
            } else {
                throw new AuthenticationError("Please Login Again!")
            }
        },
    /* GET ALL CARS */
    getAllCars: async (root, args, { Car }) => {
        const allCars = await CarModel.find().sort({ createdDate: 'desc' });
        return allCars;
      },
      /* GET A CAR */
      getCar: async (root, { _id }, { Car }) => {
        const car = await Car.findOne({ _id }).populate({
          path: 'owner',
          model: 'Car'
        });
        return car;
      },
  
      /* SEARCH CAR */
      searchCars: async (root, { searchTerm }, { Car }) => {
        // If searchTerm matches Car(s) return it/them
        if (searchTerm) {
          const searchResults = await Car.find(
            {
              $text: { $search: searchTerm }
            },
            {
              score: { $meta: 'textScore' }
            }
          ).sort({
            score: { $meta: 'textScore' }
          });
          return searchResults;
          // When searchTerm doesn't match show all Cars
        } else {
          const Cars = await Car.find().sort({
            likes: 'desc',
            createdDate: 'desc'
          });
          return Cars;
        }
      },
      /* GET USER Cars -> but this just not returns username but 
        all cars by a specific user as it described by Scehma 
        getUserCars(username: String!): [Car] v
      */
      getUserCars: async (root, { username }, { Car }) => {
        const userCars = await Car.find({ username }).sort({
          createdDate: 'desc'
        });
  
        return userCars;
      }
  },
    Mutation: {
        register: async (parent, args, context, info) => {
            const {email, password} = args

            const hashPassword = await bcrypt.hash(password, 10)

            const user = await UserModel.findOne({email: email})
            if (user) {
                throw new AuthenticationError("User Already Exists!")
            }
            try {
                const newUser = await UserModel.create({
                    email,
                    password: hashPassword
                })
                newUser.token = getToken(newUser)
                await newUser.save()
                

                return newUser
            } catch (e) {
                throw e
            }
        },
        login: async (parent, args, context, info) => {
            const {email, password} = args
            const user = await UserModel.findOne({email: email})
            if (!user) throw new AuthenticationError("User with this email doesnt exists")

            const isPassEquals = await bcrypt.compare(password, user.password)

            if (isPassEquals) {
                user.token = getToken(user)
                await user.save()

                return user
            } else {
                throw new AuthenticationError("Wrong Password or email!")
            }
        },
    }
};

module.exports = {
    resolvers,
}