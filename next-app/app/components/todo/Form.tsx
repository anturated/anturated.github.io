"use client"

import Icon from "../Icon"
import { api_url } from "@/pages/todo";

import { FormEvent, useContext } from "react";

function Form({ todos, dispatch }) {
  const API_URL = useContext(api_url);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.currentTarget;
    const value = target.todo.value;
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

    target.reset(); // resets form
  };

  return (
    <form className="flex gap-3 w-full" onSubmit={handleSubmit}>
      <label className="bg-surface-container p-3.5 rounded-2xl flex-1" htmlFor="todo">
        <input
          type="text"
          name="todo"
          id="todo"
          placeholder="Попиши мені тута"
        />
      </label>
      <button className="bg-primary text-surface min-w-15 rounded-2xl flex items-center justify-center">
        <Icon i="add" />
      </button>
    </form>
  );
}

export default Form;
