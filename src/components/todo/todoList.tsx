import { TodoSelect } from "../../db/schema";
import TodoForm from "./todoForm";
import TodoItem from "./todoIem";

export default function TodoList({ todos }: { todos: TodoSelect[] }) {
    return (
        <div>
            {todos.map((todo) => (
                <TodoItem{...todo} />
            ))}
            <TodoForm />
        </div>
    );
}