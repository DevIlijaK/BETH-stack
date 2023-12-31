import { TodoSelect } from "../../db/schema"

export default function TodoItem({ content, completed, id }: TodoSelect) {
    return (
        <div class="flex flex-row space-x-3">
            <p>{content}</p>
            <input
                type="checkbox"
                checked={completed}
                hx-post={`/todos/toggle/${id}`}
                hx-target="closest div"
                hx-swap="outerHTML"
            />
            <button class="text-red-500"
                hx-delete={`/todos/${id}`}
                hx-swap="outerHTML"
                hx-target="closest div"
            >X</button>
        </div>
    )
}