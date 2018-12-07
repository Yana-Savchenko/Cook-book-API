function setFavorites(allRecipes, favorRecipes) {
    allRecipes.map(recipe => {
        const id = recipe.dataValues.id;
        if (favorRecipes[id]) {
            recipe.dataValues.isLiked = true;
        }
        return recipe;
    })
    return allRecipes;
}

module.exports = {
    setFavorites,
}