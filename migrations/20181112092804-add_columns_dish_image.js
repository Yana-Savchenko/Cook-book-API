'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // return queryInterface.renameColumn('recipes', 'dish_foto', 'dish_photo')
    //   .then(() => queryInterface.changeColumn('recipes', 'dish_photo', {
    //     type: Sequelize.JSONB
    //   }))
    return queryInterface.addColumn('recipes', 'dish_photo', { type: Sequelize.JSONB })
      .then(() => queryInterface.removeColumn('recipes', 'dish_foto'))
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
