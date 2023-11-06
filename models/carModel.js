const {Schema, model} = require('mongoose')


const CarSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  features: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  username: {
    type: String
  },
  rating: {
    type: Number,
    default: 0
  },
  mileages: {
    type: String,
  }

});

CarSchema.index({
  "$**": "text"
})

module.exports = model('Car', CarSchema);