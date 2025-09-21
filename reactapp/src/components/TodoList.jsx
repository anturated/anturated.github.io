import Icon from "./Icon"
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

function TodoList({todos, setTodos, todoStatus}) {
  const API_URL = process.env.REACT_APP_API_URL

  useEffect(() => {
    let connection;

    async function startConnection() {
      const negotiation = await fetch(`${API_URL}/api/todos/negotiate`, {
        method: "POST",
        credentials: "omit"
      }).then(r => r.json());

      const connection = new signalR.HubConnectionBuilder()
        .withUrl(negotiation.Url, {
          accessTokenFactory: () => negotiation.AccessToken,
          withCredentials: false
        }) // proxy endpoint
        .withAutomaticReconnect()
        .build();

      connection.on("todoUpdated", (updatedTodo) => {
        console.log(`>>> UPDATE to id ${updatedTodo.id}, exists:${todos.some(t => t.id===updatedTodo.id)}`);
        setTodos((prev) =>
          prev.some(t => t.id === updatedTodo.id)
          ? prev.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
          : [...prev, updatedTodo]
        );
      });

      connection.on("todoDeleted", (deletedTodo) => {
        setTodos((prev) =>
          [...prev.filter(t => t.id !== deletedTodo.id)]
        );
      });

      await connection.start().catch(console.error);
    }

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
        todos?.map((item, index) => <Item key={index} item={item} setTodos={setTodos}/>)
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

function Item({item, setTodos}) {
  const API_URL = process.env.REACT_APP_API_URL

  const handleDelete = async () => {
    const response = await fetch(`${API_URL}/api/todos`, {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({id: item.id})
    });

    if (response.ok) {
      setTodos((prevTodos) => [
        ...prevTodos.filter(t => t.id !== item.id)
      ]);
    } else {
      console.error("error deleting");
    }
  };

  const handleCheck = async () => {
    const response = await fetch(`${API_URL}/api/todos`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({...item, done: !item.done})
    });

    if (response.ok) {
      setTodos((prevTodos) => prevTodos.map(t =>
        t.id === item.id ? {...t, done: !item.done} : t));
    } else {
      console.error("error checking");
    }
  }

  return (
    <li id={item?.id} className="todo_item">
      <button className="todo_items_left" onClick={handleCheck}>
        <Icon
          i={item.done ? "check_box" : "check_box_outline_blank"}
        />
      </button>

      <p>{item.text}</p>

      <div className="todo_items_right">
        <button>
          <span className="visually-hidden">Edit</span>
          <Icon i="edit"/>
        </button>
        <button onClick={handleDelete}>
          <span className="visually-hidden">Delete</span>
          <Icon i="delete"/>
        </button>
      </div>
    </li>
  );
}

export default TodoList;
