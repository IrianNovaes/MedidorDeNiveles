
exports.up = function(knex) {
  
  return  knex.schema.createTable('details', function(table){
      
    table.increments();
    
    table.integer('distance').notNullable();
    table.date('date').notNullable();

    table.string('auth').notNullable();
    table.foreign('auth').references('auth').inTable('modules');

    
});
};

exports.down = function(knex) {
  return knex.schema.dropTable('details');
  
};
