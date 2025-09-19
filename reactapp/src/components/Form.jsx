function Form({setTodos}) {
  const API_URL = process.env.REACT_APP_API_URL

  const handleSubmit = async (event) => {
    event.preventDefault();

    const value = event.target.todo.value;
    const response = await fetch(`${API_URL}/api/todos`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({text: value})
    });

    if (response.ok) {
      const created = await response.json();
      setTodos((prevTodos) => [
        ...prevTodos,
        {text: created.text, id: created.id, done: created.done}
      ]);
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
          placeholder="text here"
        />
      </label>
      <button>
        <span className="visually-hidden">Submit</span>
        <span className="material-icons">add</span>
      </button>
    </form>
  );
}

export default Form;
