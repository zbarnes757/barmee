import Context from '../interfaces/context';

module.exports = {
  Query: {
    currentUser(obj, args, { user }: Context) {
      return user.toJSON();
    },
  },
};
