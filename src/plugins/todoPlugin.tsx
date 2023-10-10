import { html } from "@elysiajs/html";
import Elysia, { t } from "elysia";
import TodoList from "../components/todo/todoList";
import TodoItem from "../components/todo/todoIem";
import { db } from "../db";
import { todos } from "../db/schema";
import { eq } from "drizzle-orm";

interface Config {
  prefix: string;
}

export const todoPlugin = (config: Config) =>
  new Elysia({
    name: "todoPlugin",
    seed: config,
  })
    .use(html())
    .get(`${config.prefix}`, async () => {
      const data = await db.select().from(todos).all();
      return <TodoList todos={data} />;
    })
    .post(
      `${config.prefix}/toggle/:id`,
      async ({ params }) => {
        const oldTodo = await db
          .select()
          .from(todos)
          .where(eq(todos.id, params.id))
          .get();
        const newTodo = await db
          .update(todos)
          .set({ completed: !oldTodo?.completed })
          .where(eq(todos.id, params.id))
          .returning()
          .get();
        return <TodoItem {...newTodo} />;
      },
      {
        params: t.Object({
          id: t.Numeric(),
        }),
      }
    )
    .delete(
      `${config.prefix}/:id`,
      async ({ params }) => {
        await db.delete(todos).where(eq(todos.id, params.id)).run();
      },
      {
        params: t.Object({
          id: t.Numeric(),
        }),
      }
    )
    .post(
      `${config.prefix}`,
      async ({ body }) => {
        if (body.content.length === 0) {
          throw new Error("Content cannot be empty");
        }
        const newTodo = await db.insert(todos).values(body).returning().get();
        return <TodoItem {...newTodo} />;
      },
      {
        body: t.Object({
          content: t.String(),
        }),
      }
    );
