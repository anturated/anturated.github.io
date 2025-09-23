export interface Todo {
  id: string;
  text: string;
  done: boolean;
}

export enum TodoActionType {
  SET = 'set',
  EDIT = 'edit',
  DELETE = 'delete',
}

export interface TodoAction {
  type: TodoActionType;
  todo?: Todo;
  send?: boolean;
  todos?: Todo[]; // TODO: probably bad design
}

export enum TodoServerStatus {
  ERROR,
  CONNECTING,
  CONNECTING_LONG,
  CONNECTED,
}
