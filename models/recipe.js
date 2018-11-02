module.exports = (sequelize, DataTypes) => {
    const recipe = sequelize.define('recipe', {
    //   user_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      skills: DataTypes.STRING,
      content: DataTypes.STRING,
      image: DataTypes.STRING,
    }, {});
    recipe.associate = function(models) {
        models.recipe.belongsTo(models.user, {
            foreignKey: 'user_id',
        });
    };
    return recipe;
  };