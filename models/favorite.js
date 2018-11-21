module.exports = (sequelize, DataTypes) => {
    const favorite = sequelize.define('favorite', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        user_id: DataTypes.INTEGER,
        recipe_id: DataTypes.INTEGER,

    }, {});
    
    return favorite;
};