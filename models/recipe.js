module.exports = (sequelize, DataTypes) => {
    const recipe = sequelize.define('recipe', {
      title: DataTypes.STRING,
      complexity: DataTypes.STRING,
      content: DataTypes.STRING,
      dish_photo: DataTypes.JSONB,
      cooking_time: DataTypes.STRING,
      
    }, {});
    recipe.associate = function(models) {
        models.recipe.belongsTo(models.user, {
            foreignKey: 'user_id',
        });
        models.recipe.belongsTo(models.category, {
            foreignKey: 'category_id',
        });
    };
    return recipe;
  };