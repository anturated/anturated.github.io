function TodoBanner({todo_completed, todo_total}) {
  return (
    <section className="todo_banner">
      <div>
        <p>top text</p>
        <p>bottom text</p>
      </div>
      <div>
        {todo_completed}/{todo_total}
      </div>
    </section>
  );
}

export default TodoBanner;
