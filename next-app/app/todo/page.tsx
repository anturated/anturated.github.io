"use client"

import { useContext, createContext, useReducer, useEffect, useState } from "react";

import Form from "../../components/todo/Form";
import Header from "../../components/Header";
import TodoList from "../../components/todo/TodoList";
import TodoBanner from "../../components/todo/TodoBanner";

import todoReducer from "../../lib/todoReducer";
import { Todo, TodoActionType, TodoServerStatus } from "../../components/todo/types";
import Editor from "../../components/todo/TodoEditor";
import useSWR, { Fetcher } from "swr";

export default function Home() {
  const [todos, dispatch] = useReducer(todoReducer, []);
  const [todoStatus, setStatus] = useState<TodoServerStatus>(TodoServerStatus.CONNECTING);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const fetcher: Fetcher<Todo[], string> = (url: string) => fetch(url).then(res => res.json());
  const { data, error, isLoading } = useSWR('/api/todos', fetcher);

  // TODO: remove reducer
  useEffect(() => {
    if (!isLoading) {
      dispatch({
        type: TodoActionType.SET,
        todos: data,
      });
      setStatus(TodoServerStatus.CONNECTED);
    }
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      dispatch({
        type: TodoActionType.SET,
        todos: [
          { id: crypto.randomUUID.toString(), text: "сервак не загрузив", content: "", done: false },
          { id: crypto.randomUUID.toString(), text: "на грайся поки з цим", content: "писанина", done: false },
        ]
      });
      setStatus(TodoServerStatus.ERROR);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-col gap-7 md:grid md:grid-cols-2 lg:grid-cols-3 items-start md:items-center flex-1 p-5">
        <TodoBanner
          todo_completed={todos.filter(t => t.done).length}
          todo_total={todos.length}
        />
        <div className="flex flex-col items-start h-full w-full gap-5">
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
