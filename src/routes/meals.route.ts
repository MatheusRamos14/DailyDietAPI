import { FastifyInstance } from 'fastify';
import { z } from 'zod';

import { knex } from '../database';
import { calculateBestMealSequence } from '../utils/calculateBestMealSequence';

export async function MealsRouter(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const { userId } = request.cookies;
    if (!userId) return reply.status(401).send('Unauthorized.');

    const userMeals = await knex('meals').where('user_id', userId).select('*');

    return userMeals;
  });

  app.get('/:id', async (request, reply) => {
    const { userId } = request.cookies;
    if (!userId) return reply.status(401).send('Unauthorized.');

    const updateMealParamsSchema = z.object({
      id: z.string(),
    });

    const { id } = updateMealParamsSchema.parse(request.params);

    const userMeal = await knex('meals')
      .where('id', id)
      .andWhere('user_id', userId)
      .select('*');

    return userMeal;
  });

  app.get('/metrics', async (request, reply) => {
    const { userId } = request.cookies;
    if (!userId) return reply.status(401).send('Unauthorized.');

    const mealCount = await knex('meals')
      .where('user_id', userId)
      .count({ count: '*' });
    const mealInDietCount = await knex('meals')
      .where('user_id', userId)
      .andWhere('in_diet', true)
      .count({ count: '*' });
    const mealOutDietCount = await knex('meals')
      .where('user_id', userId)
      .andWhere('in_diet', false)
      .count({ count: '*' });

    const allUserMeals = await knex('meals').where('user_id', userId);
    const bestSequence = calculateBestMealSequence(allUserMeals);

    return {
      mealCount: mealCount[0].count,
      mealInDietCount: mealInDietCount[0].count,
      mealOutDietCount: mealOutDietCount[0].count,
      bestSequence,
    };
  });

  app.post('/', async (request, reply) => {
    const { userId } = request.cookies;
    const addMealSchema = z.object({
      name: z.string(),
      description: z.string(),
      inDiet: z.boolean(),
    });

    const { name, description, inDiet } = addMealSchema.parse(request.body);
    if (!userId) return reply.status(401).send('Unauthorized.');

    await knex('meals').insert({
      name,
      description,
      in_diet: inDiet,
      user_id: userId,
    });

    return reply.status(201).send();
  });

  app.put('/:id', async (request, reply) => {
    const { userId } = request.cookies;

    const updateMealParamsSchema = z.object({
      id: z.string(),
    });
    const updateMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      inDiet: z.boolean(),
      updatedAt: z.string(),
    });

    const { id } = updateMealParamsSchema.parse(request.params);
    const { name, description, inDiet, updatedAt } = updateMealBodySchema.parse(
      request.body,
    );
    if (!userId) return reply.status(401).send('Unauthorized.');

    await knex('meals').where('id', id).andWhere('user_id', userId).update({
      name,
      description,
      in_diet: inDiet,
      user_id: userId,
      updated_at: updatedAt,
    });

    return reply.status(200).send();
  });

  app.delete('/:id', async (request, reply) => {
    const { userId } = request.cookies;

    const deleteMealParamsSchema = z.object({
      id: z.string(),
    });
    const { id } = deleteMealParamsSchema.parse(request.params);

    if (!userId) return reply.status(401).send('Unauthorized.');

    await knex('meals').where('id', id).andWhere('user_id', userId).del();

    return reply.status(200).send();
  });
}
