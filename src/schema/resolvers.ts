import User from '../models/user';

module.exports = {
  Query: {
    currentUser(obj, args, { user }: { user: User }) {
      return user.toJSON();
    },
  },
};
