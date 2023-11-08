const User = require('./../../models/user');
const Car = require('./../../models/carModel');
const Auth = require('./../../middleware/auth');

module.exports = {
  Query: {
    getUsers: async ( Auth ) => {
      return User.find(Auth);
    },

    getUser: async (parent, args, auth ) => {
      return User.findById(args.id);
    },
    /* GET ALL CARS */
    getAllCars: async (root, args, ) => {
      const allCars = await Car.find().sort({ createdDate: 'desc' });
      return allCars;
    },
    /* GET A CAR */
    getCar: async (root, { _id }, ) => {
      const car = await Car.findOne({ _id }).populate({
        path: 'owner',
        model: 'User'
      });
      return car;
    },

    /* SEARCH CAR */
    searchCars: async (root, { searchTerm }, ) => {
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
    getUserCars: async (root, { username }, ) => {
      const userCars = await Car.find({ username }).sort({
        createdDate: 'desc'
      });

      return userCars;
    },
  },

  Mutation: {
    signup: async (_, { email, username, password }) => {
      const hashedPwd = await Auth.hashPassword(password)
      const user = new User({ email, username, password: hashedPwd })
      await user.save()
      return 'new user successfully created'
    },

    login: async (_, { email, username, password }) => {
      if (!username && !email) throw new Error('email or username required')
      const userPayload = email ? { email } : {username}
      const user = await User.findOne(userPayload)
      if (!user) throw new Error('Unknown user', userPayload)

      const correctPassword = await Auth.matchPasswords(password, user.password)
      if (!correctPassword) throw new Error('invalid password')

      return {
        jwt: Auth.generateJwt({
          userId: user.id,
          username: user.username,
          email: user.email
        })
      }
    },
    logout: (_, __, { req }) => {
      if (!req.user) {
        throw new Error('You must be logged in to log out');
      }
      return true;
    },
    
    updateUser: async (_, { id, input }) => {
      const user = await User.findById(id);

      if (!user) {
        throw new Error('User not found');
      }

      // Check authorization (e.g., the user is updating their own account)
      // Implement your own authorization logic as needed

      // Update user information
      if (input.username) {
        user.username = input.username;
      }
      if (input.email) {
        user.email = input.email;
      }
      // Update other fields as needed

      // Save the updated user
      const updatedUser = await user.save();

      return updatedUser;
    },

    deleteUser: async (_, { id }, { req }) => {
      if (!req.user) {
        throw new Error('You must be logged in to delete User');
      }
      // Your delete item logic here
      return `Item with ID ${id} deleted successfully`;
    },

    /* Add a Car */
    addCar: async (
      root,
      {
        name,
        price,
        imageUrl,
        description,
        features,
        category,
        likes,
        mileages,
        rating,
        username
      },
      
    ) => {
      const newCar = await new Car({
        name,
        price,
        imageUrl,
        description,
        features,
        category,
        likes,
        mileages,
        rating,
        username
      }).save();

      return newCar;
    },

    /* Update specific user Car */
    updateUserCar: async (
      {
        _id,
        name,
        price,
        imageUrl,
        description,
        features,
        category,
        mileages,
        rating,
        input
      },
      
    ) => {
      const updatedCar = await Car.findOneAndUpdate(
        { _id },
        {
          $set: {
            name,
            price,
            imageUrl,
            description,
            features,
            category,
            mileages,
            rating
          }
        },
        { new: true }
      );
      return updatedCar;
    },

    /* DELETE SPPECIFIC USER'S Car */
    deleteUserCar: async (root, { id }) => {
      try {
        
        const deletedCar = await Car.findByIdAndDelete(id);

        if (!deletedCar) {
          throw new Error('User not found');
        }

        return deletedCar;
      } catch (error) {
        const customError = new Error('Failed to delete car');
        customError.code = 400; // Set the status code
        throw customError;
      }
    },

    /* LOGGEDIN USER CAN LIKE ANY Car */
    likeCar: async (root, { _id, username }, { Car, User }) => {
      // Increase Car's like number
      const car = await Car.findOneAndUpdate({ _id }, { $inc: { likes: 1 } });

      // User -> addToSet will add that above liked car to favorites array list
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: _id } }
      );

      return car;
    },
    /* LOGGEDIN USER CAN UNLIKE ANY Car */
    unlikeCar: async (root, { _id, username }, { Car, User }) => {
      // Decrease Car's like number
      const car = await Car.findOneAndUpdate({ _id }, { $inc: { likes: -1 } });

      // User -> $pull will remove that above unliked car from favorites array list
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { favorites: _id } }
      );

      return car;
    }
  }
}