"use client";

import "../styles/App.css";

import { useContext, createContext, useReducer, useEffect, useState } from "react";

import Form from "../app/components/Form";
import Header from "../app/components/Header";
import TodoList from "../app/components/TodoList";
import TodoBanner from "../app/components/TodoBanner";

import todoReducer from "../app/lib/todoReducer";

export default function Home() {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [todoStatus, setStatus] = useState(1);
  const API_URL = useContext(api_url);

  useEffect(() => {
    fetch(`${API_URL}/api/todos`)
      .then((res) => res.text())
      .then((data) => JSON.parse(data))
      .then((data) => dispatch({
        type: 'set',
        todos: data,
      }))
      .then(() => setStatus(0))
      .catch(e => {
        console.error("error fetching todods: " + e);
        setStatus(-1);
      })
    const timer = setInterval(() => {
      if (status === 1)
        setStatus(2);
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
      <TodoList todos={todos} dispatch={dispatch} todoStatus={todoStatus} />
    </div>
  );
}

export const api_url = createContext(process.env.NEXT_PUBLIC_API_URL);
