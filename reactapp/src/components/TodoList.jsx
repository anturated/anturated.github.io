function TodoList({todos, setTodos}) {
  return (
    <ol className="todo_list">
      {todos && todos.length > 0 ? (
        todos?.map((item, index) => <Item key={index} item={item} setTodos={setTodos}/>)
      ) : (
        <p>so empty</p>
      )}
    </ol>
  );
}

function Item({item, setTodos}) {
  const API_URL = process.env.REACT_APP_API_URL
  console.log(API_URL);

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
        <span className="material-icons">
          {item.done ? "check_box" : "check_box_outline_blank"}
        </span>
      </button>

      <p>{item.text}</p>

      <div className="todo_items_right">
        <button>
          <span className="visually-hidden">Edit</span>
          <span className="material-icons">edit</span>
        </button>
        <button onClick={handleDelete}>
          <span className="visually-hidden">Delete</span>
          <span className="material-icons">delete</span>
        </button>
      </div>
    </li>
  );
}

export default TodoList;
