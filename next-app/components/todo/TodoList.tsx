"use client"

import { useContext, useState, useEffect, useRef, ActionDispatch, FormEvent, Dispatch, SetStateAction } from "react";
import * as signalR from "@microsoft/signalr";

import Icon from "../Icon"
import { Todo, TodoAction, TodoActionType, TodoServerStatus } from "./types";

interface TodoListProps {
  todos: Todo[],
  dispatch: ActionDispatch<[action: TodoAction]>,
  todoStatus: TodoServerStatus
  setSelectedTodo: Dispatch<SetStateAction<Todo | null>>
}

interface ItemProps {
  item: Todo,
  dispatch: ActionDispatch<[action: TodoAction]>,
  setSelectedTodo: Dispatch<SetStateAction<Todo | null>>
}

function TodoList({ todos, dispatch, todoStatus, setSelectedTodo }: TodoListProps) {
  // connect to SignalR
  // useEffect(() => {
  //   let connection: signalR.HubConnection | undefined;
  //
  //   async function startConnection() {
  //     // get url and credentials
  //     const negotiation = await fetch('/api/todos/negotiate', {
  //       method: "POST",
  //       credentials: "omit" // CORS
  //     }).then(r => r.json())
  //       .catch(() => {
  //         throw Error("could not negotiate");
  //       });
  //
  //     // create connection to Azure SignalR thing
  //     const connection = new signalR.HubConnectionBuilder()
  //       .withUrl(negotiation.Url, {
  //         accessTokenFactory: () => negotiation.AccessToken,
  //         withCredentials: false // CORS
  //       })
  //       .withAutomaticReconnect()
  //       .build();
  //
  //     // bind to todo updates / add
  //     connection.on("todoUpdated", (updatedTodo) => {
  //       dispatch({
  //         type: TodoActionType.EDIT,
  //         todo: updatedTodo,
  //       });
  //     });
  //
  //     // bind to todo deletes
  //     connection.on("todoDeleted", (deletedTodo) => {
  //       dispatch({
  //         type: TodoActionType.DELETE,
  //         todo: deletedTodo
  //       })
  //     });
  //
  //     await connection.start().catch(console.error);
  //   }
  //
  //   // async workaround
  //   startConnection().catch(e => {
  //     console.error(e);
  //   });
  //
  //   return () => {
  //     if (connection) {
  //       connection.stop();
  //     }
  //   };
  // }, []);

  const todoEmptyMessage: Record<TodoServerStatus, string> = {
    [TodoServerStatus.ERROR]: "Не загрузило :(",
    [TodoServerStatus.CONNECTED]: "Якось порожньо",
    [TodoServerStatus.CONNECTING]: "Гружусі",
    [TodoServerStatus.CONNECTING_LONG]: "Мабуть сервак спить",
  }

  return <>
    {todos && todos.length > 0 ? (
      <ol className="w-full space-y-5">
        {todos?.map((item, index) => <Item key={index} item={item} dispatch={dispatch} setSelectedTodo={setSelectedTodo} />)}
      </ol>
    ) : (
      <div className="flex items-center justify-center h-full w-full">
        <span className="text-center">{todoEmptyMessage[todoStatus]}</span>
      </div>
    )}
  </>;
}

function Item({ item, dispatch, setSelectedTodo }: ItemProps) {

  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // delete button logic
  const handleDelete = async () => {
    const response = await fetch('/api/todos', {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item)
    });

    if (response.ok) {
      dispatch({
        type: TodoActionType.DELETE,
        todo: await response.json(),
      })
    } else {
      console.error("error deleting");
    }
  };

  // checkbox button logic
  const handleCheck = async () => {
    console.log("sending request to server");
    const response = await fetch('/api/todos', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, done: !item.done })
    });

    if (response.ok) {
      console.log("response ok, dispatching");
      dispatch({
        type: TodoActionType.EDIT,
        todo: { ...item, done: !item.done }
      });
    } else {
      console.error("error checking");
    }
  }

  // go into editing mode on edit press
  const handleEdit = async () => {
    setEditing(true);
  }

  useEffect(() => {
    if (editing && inputRef.current) {
      // focus input
      inputRef.current.focus();

      // select everything
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length,
      );
    }
  }, [editing]);

  // send to server
  const handleEditFinish = async () => {
    const prevText = item.text;
    const newText = inputRef.current!.value;

    dispatch({
      type: TodoActionType.EDIT,
      todo: { ...item, text: newText }
    });

    const response = await fetch('/api/todos', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, text: newText })
    });

    if (response.ok) {
    } else {
      console.error("error editing");

      dispatch({
        type: TodoActionType.EDIT,
        todo: { ...item, text: prevText }
      });
    }
  }

  // on enter press
  const handleInputSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEditing(false);
    handleEditFinish();
  }

  // on mouse leave
  const handleInputBlur = () => {
    setEditing(false);
    handleEditFinish();
  }

  const modifiers = item.content ? " italic" : "";

  return (
    <li id={item?.id}
      className="bg-surface-container outline-1 outline-outline/50 rounded-2xl">
      <div className="flex flex-row items-center justify-center p-3">
        <button className="p-1 flex items-center justify-center" onClick={handleCheck}>
          <Icon
            i={item.done ? "check_box" : "check_box_outline_blank"}
          />
        </button>

        {!editing ? (
          <span className={"flex-1 text-center" + modifiers}
            onClick={() => setSelectedTodo(item)}>{item.text}</span>
        ) : (
          <form className="outline-0 flex-1 flex justify-center" onSubmit={handleInputSubmit}>
            <input
              className="outline-0 text-center flex-1"
              ref={inputRef}
              type="text"
              name="edit-todo"
              id="edit-todo"
              defaultValue={item?.text}
              onBlur={handleInputBlur}
            />
          </form>
        )}
        <div className="flex flex-row gap-1 p-1">
          <button className="flex items-center justify-center" onClick={handleEdit}>
            <Icon i="edit" />
          </button>
          <button className="flex items-center justify-center" onClick={handleDelete}>
            <Icon i="delete" />
          </button>
        </div>
      </div>
    </li >
  );
}

export default TodoList;
