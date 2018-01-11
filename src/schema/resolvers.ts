module.exports = {
  Query: {
    currentUser(obj, args, { user }) {
      return user.toJSON();
    },
  },
};
