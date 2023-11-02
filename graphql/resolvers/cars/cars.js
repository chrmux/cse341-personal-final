const Car = require('../../../models/car')

module.exports = {
    Query: {
        /* GET ALL CARS */
        getAllCars: async (root, args,) => {
          const allCars = await Car.find().sort({ createdDate: 'desc' });
          return allCars;
        },
        /* GET A CAR */
        getCar: async (root, { _id } ) => {
          const car = await Car.findOne({ _id }).populate({
            path: 'owner',
            model: 'User'
          });
          return car;
        },
    
        /* SEARCH CAR */
        searchCars: async (root, { searchTerm } ) => {
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
        },
  }
}