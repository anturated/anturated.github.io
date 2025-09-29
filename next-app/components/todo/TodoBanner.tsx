interface TodoStatsProps {
  todo_completed: number,
  todo_total: number
}

function TodoBanner({ todo_completed, todo_total }: TodoStatsProps) {
  return (
    <div className=" grid items-center w-full grid-cols-2 bg-surface-container-lowest rounded-2xl outline-outline outline-1 p-4">
      <div className="flex flex-col items-center gap-3">
        <span className="text-4xl font-semibold">Цево</span>
        <span className="italic">{
          todo_completed == todo_total && todo_total !== 0
            ? "Хороший хлопчик"
            : "Давай там"
        }</span>
      </div>

      <div className="flex relative justify-center items-center">
        <svg className="w-30 h-30">
          <circle
            className="text-surface-container-high"
            cx="60"
            cy="60"
            r="55"
            fill="currentColor"
          />
        </svg>
        <span className="text-2xl absolute inset-0 flex justify-center items-center">
          {todo_completed}/{todo_total}
        </span>
      </div>
    </div>
  );
}

export default TodoBanner;
