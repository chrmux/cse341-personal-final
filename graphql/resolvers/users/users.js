const User = require('../../../models/user')
const Auth = require('../../../services/auth.service')

module.exports = {
  Query: {
    async getUsers(_, { id }) {
      try {
        const userId = await User.find({ id: id });
        return userId;
      } catch (err) {
        throw new Error(err);
      }
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
  }
}