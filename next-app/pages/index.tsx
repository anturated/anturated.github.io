"use client";

import "../styles/App.css";

import { useContext, createContext, useReducer, useEffect, useState } from "react";

import Form from "../app/components/Form";
import Header from "../app/components/Header";
import TodoList from "../app/components/TodoList";
import TodoBanner from "../app/components/TodoBanner";

import todoReducer from "../app/lib/todoReducer";
import { Todo, TodoActionType, TodoServerStatus } from "../app/components/types";
import Editor from "../app/components/TodoEditor";

export default function Home() {
  const API_URL = useContext(api_url);
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [todoStatus, setStatus] = useState<TodoServerStatus>(TodoServerStatus.CONNECTING);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/todos`)
      .then((res) => res.text())
      .then((data) => JSON.parse(data))
      .then((data) => dispatch({
        type: TodoActionType.SET,
        todos: data,
      }))
      .then(() => setStatus(TodoServerStatus.CONNECTED))
      .catch(e => {
        console.error("error fetching todods: " + e);
        setStatus(TodoServerStatus.ERROR);
      })

    setInterval(() => {
      if (todoStatus == 1)
        setStatus(TodoServerStatus.CONNECTING_LONG);
    }, 2000);
  }, []);

  return (
    <div className="App">
      <Header />
      <TodoBanner
        todo_completed={todos.filter(t => t.done).length}
        todo_total={todos.length}
      />
      <Form todos={todos} dispatch={dispatch} />
      <TodoList todos={todos} dispatch={dispatch}
        todoStatus={todoStatus}
        setSelectedTodo={setSelectedTodo}
      />
      {
        selectedTodo && (
          <Editor todo={selectedTodo} setSelectedTodo={setSelectedTodo} dispatch={dispatch} />
        )
      }
    </div>
  );
}

export const api_url = createContext(process.env.NEXT_PUBLIC_API_URL);
