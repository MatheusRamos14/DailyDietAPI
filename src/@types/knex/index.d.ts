import { Knex } from 'knex';

declare module 'knex/types/tables' {
  interface User {
    id: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
  }

  interface Meal {
    id: string;
    user_id: string;
    name: string;
    description: string;
    in_diet: boolean;
    created_at: string;
    updated_at: string;
  }

  interface Tables {
    // For more advanced types, you can specify separate type
    // for base model, "insert" type and "update" type.
    // But first: notice that if you choose to use this,
    // the basic typing showed above can be ignored.
    // So, this is like specifying
    //    knex
    //    .insert<{ name: string }>({ name: 'name' })
    //    .into<{ name: string, id: number }>('users')
    users: Knex.CompositeTableType<
      User,
      Pick<User, 'name' | 'email'> &
        Partial<Pick<User, 'created_at' | 'updated_at'>>,
      Partial<Omit<User, 'id'>>
    >;

    meals: Knex.CompositeTableType<
      Meal,
      Pick<Meal, 'name' | 'description' | 'in_diet' | 'user_id'> &
        Partial<Pick<Meal, 'created_at' | 'updated_at'>>,
      Partial<Omit<Meal, 'id'>>
    >;
  }
}
