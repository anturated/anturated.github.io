import {useEffect, useState} from "react";
import logo from './logo.svg';
import './App.css';

import Form from "./components/Form";
import Header from "./components/Header";
import TodoList from "./components/TodoList";
import TodoBanner from "./components/TodoBanner";

function App() {
  const API_URL = process.env.REACT_APP_API_URL

  const [todos, setTodos] = useState([]);
  var todoStatus = 1;

  useEffect(() => {

    try {
      fetch(`${API_URL}/api/todos`)
      .then((res) => res.text())
      .then((data) => JSON.parse(data))
      .then((data) => setTodos(data))

      todoStatus = 0;
    } catch (error) {
      console.error(error);
      todoStatus = -1;
    }
  }, []);

  return (
    <div className="App">
      <Header/>
      <TodoBanner
        todo_completed={todos.filter(t => t.done).length}
        todo_total={todos.length}
      />
      <Form setTodos={setTodos}/>
      <TodoList todos={todos} setTodos={setTodos} todoStatus={todoStatus}/>
    </div>
  );
}

export default App;
