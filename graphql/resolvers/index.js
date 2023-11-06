const User = require('./../../models/user')
const Auth = require('./../../middleware/auth')

module.exports = {
  Query: {
    getUsers: async () => {
      return User.find();
    },

    getUser: async (parent, args) => {
      return User.findById(args.id);
    }
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
  }
}