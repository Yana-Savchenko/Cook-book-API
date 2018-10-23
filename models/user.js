module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    age: DataTypes.INTEGER,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    avatar_path: DataTypes.STRING,
    avatar_name: DataTypes.STRING,
  }, {});
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};