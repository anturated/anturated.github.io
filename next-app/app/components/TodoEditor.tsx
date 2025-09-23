import { ActionDispatch, Dispatch, SetStateAction, useContext, useRef, useState } from "react";
import { Todo, TodoAction } from "./types";
import Icon from "./Icon";
import { api_url } from "../../pages";

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
    <div className="modal-overlay" >
      <div className="modal-content">
        <textarea

          placeholder="Шооо тут можна писати"
          value={text}
          onChange={e => setText(e.currentTarget.value)}
        />
        <div className="modal-buttons">
          <button onClick={() => handleClose(true)}>
            <Icon i="save" />
          </button>
          <button onClick={() => handleClose(false)}>
            <Icon i="close" />
          </button>
        </div>
      </div>
    </div>
  )
}
