'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'recipes',
      'category_id',
      {
        type: Sequelize.INTEGER,
      }
    ).then(() => {
      return queryInterface.addConstraint('recipes', ['category_id'], {
        type: 'foreign key',
        name: 'recipes_category_id_fkey',
        references: { //Required field
          table: 'categories',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('recipes', 'recipes_category_id_fkey')
      .then(() => {queryInterface.removeColumn('recipes', 'category_id')})
  }
};
