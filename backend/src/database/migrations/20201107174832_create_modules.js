
exports.up = function(knex) {
  return  knex.schema.createTable('modules', function(table){
    
    table.increments();

    table.string('auth').notNullable();  
    table.string('module_id').notNullable();

    table.float('max_distance');
    table.float('min_distance');
    table.string('name').defaultTo('no name');
    
});
};

exports.down = function(knex) {
  return knex.schema.dropTable('modules');
};
