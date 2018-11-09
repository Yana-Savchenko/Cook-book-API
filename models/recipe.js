module.exports = (sequelize, DataTypes) => {
    const recipe = sequelize.define('recipe', {
      title: DataTypes.STRING,
      skills: DataTypes.STRING,
      content: DataTypes.STRING,
      image: DataTypes.STRING,
      
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