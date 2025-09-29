import { ActionDispatch, Dispatch, SetStateAction, useContext, useRef, useState } from "react";
import { Todo, TodoAction, TodoActionType } from "./types";
import Icon from "../Icon";

interface EditorProps {
  todo: Todo;
  dispatch: ActionDispatch<[action: TodoAction]>;
  setSelectedTodo: Dispatch<SetStateAction<Todo | null>>
}

export default function Editor({ todo, dispatch, setSelectedTodo }: EditorProps) {
  const [text, setText] = useState(todo.content);

  const handleClose = async (save: boolean) => {
    if (save) {
      const response = await fetch('/api/todos', {
        method: "POST",
        body: JSON.stringify({ ...todo, content: text }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        dispatch({
          type: TodoActionType.EDIT,
          todo: await response.json(),
        })
      }
    }
    setSelectedTodo(null);
  }

  return (
    <div className="backdrop-blur-2xl min-h-screen min-w-screen bg-surface-container-low/50 fixed top-0 left-0 flex items-center justify-center" >
      <div className="relative bg-surface-container-lowest shadow-shadow shadow rounded-2xl p-3 flex flex-col">
        <textarea
          className="resize-none min-h-70 min-w-85 md:min-w-xl outline-none"
          placeholder="Шооо тут можна писати"
          value={text}
          onChange={e => setText(e.currentTarget.value)}
        />
        <div className="flex justify-end gap-2">
          <button className="hover:text-tertiary" onClick={() => handleClose(true)}>
            <Icon i="save" />
          </button>
          <button className="hover:text-error" onClick={() => handleClose(false)}>
            <Icon i="close" />
          </button>
        </div>
      </div>
    </div>
  )
}
