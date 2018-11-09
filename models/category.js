module.exports = (sequelize, DataTypes) => {
    const category = sequelize.define('category', {
      category_name: DataTypes.STRING,
      
    }, {});
    return category;
  };