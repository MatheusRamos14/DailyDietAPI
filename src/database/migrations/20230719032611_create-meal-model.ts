import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary();
    table.uuid('user_id').references('users.id').notNullable();
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.boolean('in_diet').notNullable();
    table.date('updated_at').defaultTo(knex.fn.now());
    table.date('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals');
}
