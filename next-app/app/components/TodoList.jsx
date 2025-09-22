"use client"

import { useContext, useState, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";

import Icon from "./Icon"
import { api_url } from "../page";

function TodoList({ todos, dispatch, todoStatus }) {
  const API_URL = useContext(api_url);

  // connect to SignalR
  useEffect(() => {
    let connection;

    async function startConnection() {
      // get url and credentials
      const negotiation = await fetch(`${API_URL}/api/todos/negotiate`, {
        method: "POST",
        credentials: "omit" // CORS
      }).then(r => r.json());

      // create connection to Azure SignalR thing
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(negotiation.Url, {
          accessTokenFactory: () => negotiation.AccessToken,
          withCredentials: false // CORS
        })
        .withAutomaticReconnect()
        .build();

      // bind to todo updates / add
      connection.on("todoUpdated", (updatedTodo) => {
        dispatch({
          type: 'edit',
          todo: updatedTodo,
        });
      });

      // bind to todo deletes
      connection.on("todoDeleted", (deletedTodo) => {
        dispatch({
          type: 'delete',
          id: deletedTodo.id
        })
      });

      await connection.start().catch(console.error);
    }

    // async workaround
    startConnection();

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  return (
    <ol className="todo_list">
      {todos && todos.length > 0 ? (
        todos?.map((item, index) => <Item key={index} item={item} dispatch={dispatch} />)
      ) : (
        <p>{
          todoStatus === -1 ? "Не загрузило :(" :
            todoStatus === 0 ? "Якось порожньо" :
              todoStatus === 1 ? "Гружусі" :
                todoStatus === 2 ? "Мабуть сервак спить" :
                  "Помилка чи шо"
        }</p>
      )}
    </ol>
  );
}

function Item({ item, dispatch }) {
  const API_URL = useContext(api_url);

  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);

  // delete button logic
  const handleDelete = async () => {
    const response = await fetch(`${API_URL}/api/todos`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id })
    });

    if (response.ok) {
      // TODO: reducer
    } else {
      console.error("error deleting");
    }
  };

  // checkbox button logic
  const handleCheck = async () => {
    const response = await fetch(`${API_URL}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, done: !item.done })
    });

    if (response.ok) {
      dispatch({
        type: 'edit',
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
    const newText = inputRef.current.value;

    dispatch({
      type: 'edit',
      todo: { ...item, text: newText }
    });

    const response = await fetch(`${API_URL}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, text: newText })
    });

    if (response.ok) {
    } else {
      console.error("error editing");

      dispatch({
        type: 'edit',
        todo: { ...item, text: prevText }
      });
    }
  }

  // on enter press
  const handleInputSubmit = (event) => {
    event.preventDefault();
    setEditing(false);
    handleEditFinish();
  }

  // on mouse leave
  const handleInputBlur = () => {
    setEditing(false);
    handleEditFinish();
  }

  return (
    <li id={item?.id} className="todo_item">
      {!editing ? (
        <>
          <button className="todo_items_left" onClick={handleCheck}>
            <Icon
              i={item.done ? "check_box" : "check_box_outline_blank"}
            />
          </button>

          <p>{item.text}</p>

          <div className="todo_items_right">
            <button onClick={handleEdit}>
              <span className="visually-hidden">Edit</span>
              <Icon i="edit" />
            </button>
            <button onClick={handleDelete}>
              <span className="visually-hidden">Delete</span>
              <Icon i="delete" />
            </button>
          </div>
        </>
      ) : (
        <form className="edit-form" onSubmit={handleInputSubmit}>
          <label htmlFor="edit-todo">
            <input
              ref={inputRef}
              type="text"
              name="edit-todo"
              id="edit-todo"
              defaultValue={item?.text}
              onBlur={handleInputBlur}
            />
          </label>
        </form>
      )}
    </li>
  );
}

export default TodoList;
