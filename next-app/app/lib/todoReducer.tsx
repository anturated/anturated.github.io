import { Todo, TodoAction, TodoActionType } from "../components/todo/types"

export default function todoReducer(todos: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case TodoActionType.SET: {
      return action.todos!;
    }

    case TodoActionType.EDIT: {
      if (todos.find(t => t.id === action.todo!.id)) {
        const mutated = todos.map(t => t.id == action.todo!.id ? action.todo! : t)
        console.log(mutated.join(" "));
        return mutated;
      } else {
        return [...todos, action.todo!];
      }
    }

    case TodoActionType.DELETE: {
      return todos.filter(t => t.id !== action.todo!.id);
    }

    default: {
      throw Error('Unexpected action: ' + action.type);
    }
  }
}
