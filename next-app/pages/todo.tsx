"use client";

import { useContext, createContext, useReducer, useEffect, useState } from "react";

import Form from "../app/components/todo/Form";
import Header from "../app/components/Header";
import TodoList from "../app/components/todo/TodoList";
import TodoBanner from "../app/components/todo/TodoBanner";

import todoReducer from "../app/lib/todoReducer";
import { Todo, TodoActionType, TodoServerStatus } from "../app/components/todo/types";
import Editor from "../app/components/todo/TodoEditor";

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
        dispatch({
          type: TodoActionType.SET,
          todos: [
            { id: crypto.randomUUID.toString(), text: "сервак не загрузив", content: "", done: false },
            { id: crypto.randomUUID.toString(), text: "на грайся поки з цим", content: "писанина", done: false },
          ]
        })
      })

    setInterval(() => {
      if (todoStatus == TodoServerStatus.CONNECTING)
        setStatus(TodoServerStatus.CONNECTING_LONG);
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen md:flex md:flex-col">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center flex-1">
        <TodoBanner
          todo_completed={todos.filter(t => t.done).length}
          todo_total={todos.length}
        />
        <div className="flex flex-col items-start h-full p-5 gap-5">
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
      </div>
    </div>
  );
}

export const api_url = createContext(process.env.NEXT_PUBLIC_API_URL);
