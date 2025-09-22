"use client"

import Icon from "./Icon"
import { api_url } from "../page";

import { useContext } from "react";

function Form({ todos, dispatch }) {
  const API_URL = useContext(api_url);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const value = event.target.todo.value;
    const response = await fetch(`${API_URL}/api/todos`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: value })
    });

    if (response.ok) {
      const created = await response.json();
      if (!todos.some(t => t.id === created.id))
        dispatch({
          type: 'edit',
          todo: { text: created.text, id: created.id, done: created.done },
        });
    } else {
      console.error("failed to add todo");
    }

    event.target.reset(); // resets form
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label htmlFor="todo">
        <input
          type="text"
          name="todo"
          id="todo"
          placeholder="Попиши мені тута"
        />
      </label>
      <button>
        <span className="visually-hidden">Submit</span>
        <Icon i="add" />
      </button>
    </form>
  );
}

export default Form;
