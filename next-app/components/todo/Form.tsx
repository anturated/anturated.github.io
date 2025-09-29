"use client"

import Icon from "../Icon"
import { FormEvent, useContext } from "react";
import { Todo } from "./types";

function Form({ todos, dispatch }) {

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.currentTarget;
    const value = target.todo.value;
    const response = await fetch('/api/todos', {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: value })
    });

    if (response.ok) {
      const created = await response.json();
      if (!todos.some((t: Todo) => t.id === created.id))
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
      <input
        className="bg-surface-container p-3.5 rounded-2xl flex-1 outline-0"
        type="text"
        name="todo"
        id="todo"
        placeholder="Попиши мені тута"
      />
      <button className="bg-primary text-surface min-w-15 rounded-2xl flex items-center justify-center">
        <Icon i="add" />
      </button>
    </form>
  );
}

export default Form;
