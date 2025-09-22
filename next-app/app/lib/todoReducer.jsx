function todoReducer(todos, action) {
  switch (action.type) {
    case 'set': {
      return action.todos;
    }

    case 'edit': {
      if (todos.some(t => t.id === action.todo.id)) {
        const text = action.send ?? "no send";
        console.log(text);
        return todos.map(t => t.id === action.todo.id ? action.todo : t);
      } else {
        return [...todos, action.todo];
      }
    }

    case 'delete': {
      return todos.filter(t => t.id !== action.id);
    }

    default: {
      throw Error('Unexpected action: ' + action.type);
    }
  }
}

async function dbEdit(method, body) {
  const API_URL = process.env.REACT_APP_API_URL + "/api/todos";

  const response = await fetch(API_URL, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return response;

}

export default todoReducer;
