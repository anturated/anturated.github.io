import { ActionDispatch, Dispatch, SetStateAction, useContext, useRef, useState } from "react";
import { Todo, TodoAction } from "./types";
import Icon from "../Icon";
import { api_url } from "@/pages/todo";

interface EditorProps {
  todo: Todo;
  dispatch: ActionDispatch<[action: TodoAction]>;
  setSelectedTodo: Dispatch<SetStateAction<Todo | null>>
}

export default function Editor({ todo, dispatch, setSelectedTodo }: EditorProps) {
  const API_URL = useContext(api_url);

  const [text, setText] = useState(todo.content);

  const handleClose = async (save: boolean) => {
    if (save) {
      await fetch(`${API_URL}/api/todos`, {
        method: "POST",
        body: JSON.stringify({ ...todo, content: text }),
        headers: { "Content-Type": "application/json" },
      })
    }
    setSelectedTodo(null);
  }

  return (
    <div className="min-h-screen min-w-screen bg-surface-container/50 fixed top-0 left-0 flex items-center justify-center" >
      <div className="relative bg-surface-container-lowest shadow-shadow shadow rounded-2xl p-3 flex flex-col">
        <textarea
          className="resize-none min-h-70 min-w-85 md:min-w-xl"
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
