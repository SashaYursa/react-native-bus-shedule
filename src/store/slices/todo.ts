import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {act} from 'react-test-renderer';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface todoState {
  todos: Todo[];
}

const initialState: todoState = {
  todos: [],
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo(state, action: PayloadAction<Todo>) {
      state.todos.push(action.payload);
    },
    remove(state, action) {
      state.todos = [];
    },
  },
});

export default todoSlice.reducer;
export const {addTodo, remove} = todoSlice.actions;
