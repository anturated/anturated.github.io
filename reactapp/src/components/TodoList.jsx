import Icon from "./Icon"
import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

function TodoList({ todos, setTodos, todoStatus }) {
  const API_URL = process.env.REACT_APP_API_URL

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
        setTodos((prev) =>
          prev.some(t => t.id === updatedTodo.id)
            ? prev.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
            : [...prev, updatedTodo]
        );
      });

      // bind to todo deletes
      connection.on("todoDeleted", (deletedTodo) => {
        setTodos((prev) =>
          [...prev.filter(t => t.id !== deletedTodo.id)]
        );
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
        todos?.map((item, index) => <Item key={index} item={item} setTodos={setTodos} />)
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

function Item({ item, setTodos }) {
  const API_URL = process.env.REACT_APP_API_URL

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
      setTodos((prevTodos) => [
        ...prevTodos.filter(t => t.id !== item.id)
      ]);
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
      setTodos((prevTodos) => prevTodos.map(t =>
        t.id === item.id ? { ...t, done: !item.done } : t));
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

    setTodos((prevTodos) => prevTodos.map(t =>
      t.id === item.id ? { ...t, text: newText } : t));

    const response = await fetch(`${API_URL}/api/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, text: newText })
    });

    if (response.ok) {
    } else {
      console.error("error editing");
      setTodos((prevTodos) => prevTodos.map(t =>
        t.id === item.id ? { ...t, text: prevText } : t));
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
            // onChange={handleinputchan}
            />
          </label>
        </form>
      )}
    </li>
  );
}

export default TodoList;
