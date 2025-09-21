import Icon from "./Icon"
function Form({ setTodos }) {
  const API_URL = process.env.REACT_APP_API_URL

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
      setTodos((prevTodos) =>
        prevTodos.some(t => t.id === created.id)
          ? prevTodos
          : [...prevTodos, { text: created.text, id: created.id, done: created.done }]);
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
