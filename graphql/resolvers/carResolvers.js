const carModel = require('../../models/carModel');
const Car = require('../../models/carModel')
const User = require('../../models/userModel')

const carResolvers = {
    Query: {
        /* GET ALL CARS */
        getAllCars: async (root, args ) => {
          const car = await Car.find().sort({ createdDate: 'desc' });
          return car;
        },
        /* GET A CAR */
        getCar: async (root, { _id } ) => {
          const car = await Car.findOne({ _id }).populate({
            path: 'owner',
            model: 'Car'
          });
          return car;
        },
    
        /* SEARCH CAR */
        searchCars: async (root, { searchTerm }) => {
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
        getUserCars: async (root, { username } ) => {
          const userCars = await Car.find({ username }).sort({
            createdDate: 'desc'
          });
    
          return userCars;
        }
    },
        Mutation: {
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
              root,
              {
                _id,
                name,
                price,
                imageUrl,
                description,
                features,
                category,
                mileages,
                rating
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
            }
    },
    deleteUserCar: async (root, { _id }) => {
        const car = await Car.findOneAndRemove({ _id });
        return car;
      },
  
      /* LOGGEDIN USER CAN LIKE ANY Car */
      likeCar: async (root, { _id, username }, { Car, User }) => {
        // Increase Car's like number
        const car = await carModel.findOneAndUpdate({ _id }, { $inc: { likes: 1 } });
  
        // User -> addToSet will add that above liked car to favorites array list
        const user = await userModel.findOneAndUpdate(
          { username },
          { $addToSet: { favorites: _id } }
        );
  
        return car, user;
      },
      /* LOGGEDIN USER CAN UNLIKE ANY Car */
      unlikeCar: async (root, { _id, username }) => {
        // Decrease Car's like number
        const car = await Car.findOneAndUpdate({ _id }, { $inc: { likes: -1 } });
  
        // User -> $pull will remove that above unliked car from favorites array list
        const user = await User.findOneAndUpdate(
          { username },
          { $pull: { favorites: _id } }
        );
  
        return car, user;
      }
};

module.exports = {
    carResolvers,
}