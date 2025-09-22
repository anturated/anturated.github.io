import { useEffect, useReducer } from "react";
import todoReducer from "./components/todoReducer"
import './App.css';

import Form from "./components/Form";
import Header from "./components/Header";
import TodoList from "./components/TodoList";
import TodoBanner from "./components/TodoBanner";

function App() {
  const API_URL = process.env.REACT_APP_API_URL

  // const [todos, setTodos] = useState([]);
  const [todos, dispatch] = useReducer(todoReducer, []);
  var todoStatus = 1;

  useEffect(() => {

    try {
      fetch(`${API_URL}/api/todos`)
        .then((res) => res.text())
        .then((data) => JSON.parse(data))
        .then((data) => dispatch({
          type: 'set',
          todos: data,
        }))


      todoStatus = 0;
    } catch (error) {
      console.error(error);
      todoStatus = -1;
    }
  }, []);

  return (
    <div className="App">
      <Header />
      <TodoBanner
        todo_completed={todos.filter(t => t.done).length}
        todo_total={todos.length}
      />
      <Form todos={todos} dispatch={dispatch} />
      <TodoList todos={todos} dispatch={dispatch} todoStatus={todoStatus} />
    </div>
  );
}

export default App;
