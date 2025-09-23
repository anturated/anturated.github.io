interface TodoStatsProps {
  todo_completed: number,
  todo_total: number
}

function TodoBanner({ todo_completed, todo_total }: TodoStatsProps) {
  return (
    <section className="todo_banner">
      <div>
        <p className="text_large">Цево</p>
        <p className="text_small">{
          todo_completed == todo_total && todo_total !== 0
            ? "Хороший хлопчик"
            : "Давай там"
        }</p>
      </div>
      <div>
        {todo_completed}/{todo_total}
      </div>
    </section>
  );
}

export default TodoBanner;
