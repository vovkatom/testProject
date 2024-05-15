import { createSlice } from '@reduxjs/toolkit';

import {
  fetchBoards,
  addBoard,
  deleteBoard,
  updateBoardById,
  updateBoardPatchById,
  // addTask,
  // addColumn,
  // updateColumnTitle,
  // deleteColumn,
  // updateTask,
  // updateTaskPlace,
  // deleteTask,
} from './userBoard-operations';
const handlePending = (state) => {
  state.isLoading = true;
};

const handleRejected = (state, action) => {
  state.error = action.payload;
  state.isLoading = false;
};

const boardsSlice = createSlice({
  name: 'boards',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
    currentBoard: {
      title: '',
      id: '',
    },
    filter: null,
  },
  reducers: {
    selectBoard(state, action) {
      state.currentBoard = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    dragAndDropTask: (state, action) => {
      const { destination, source } = action.payload;

      const columnIndex = state.items[state.currentBoard].columns.findIndex(
        (column) => column._id === source.droppableId
      );

      const task =
        state.items[state.currentBoard].columns[columnIndex].tasks[
          source.index
        ];
      task.column = destination.droppableId;

      const newColumnIndex = state.items[state.currentBoard].columns.findIndex(
        (column) => column._id === destination.droppableId
      );

      state.items[state.currentBoard].columns[columnIndex].tasks.splice(
        source.index,
        1
      );

      state.items[state.currentBoard].columns[newColumnIndex].tasks.splice(
        destination.index,
        0,
        task
      );
    },
    dragAndDropColumn: (state, action) => {
      const { destination, source, draggableId } = action.payload;

      const column = state.items[state.currentBoard].columns.find(
        (column) => column._id === draggableId
      );

      state.items[state.currentBoard].columns.splice(source.index, 1);

      state.items[state.currentBoard].columns.splice(
        destination.index,
        0,
        column
      );
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items = action.payload;
      })
      .addCase(fetchBoards.pending, handlePending)
      .addCase(fetchBoards.rejected, handleRejected)
      .addCase(addBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.items.push({ ...action.payload, columns: [] });
      })
      .addCase(addBoard.pending, handlePending)
      .addCase(addBoard.rejected, handleRejected)
      .addCase(updateBoardById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const index = state.items.findIndex(
          (board) => board._id === action.payload._id
        );

        state.items[index] = action.payload;
      })
      .addCase(updateBoardById.pending, handlePending)
      .addCase(updateBoardById.rejected, handleRejected)
      .addCase(updateBoardPatchById.pending, handlePending)
      .addCase(updateBoardPatchById.rejected, handleRejected)
      .addCase(deleteBoard.pending, handlePending)
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        const index = state.items.findIndex(
          (board) => board._id === action.payload
        );
        state.items.splice(index, 1);
        if (state.items.length === 0) {
          state.currentBoard = null;
        } else {
          state.currentBoard = 0;
        }
      })
      .addCase(deleteBoard.rejected, handleRejected),
  // .addCase(addColumn.fulfilled, (state, action) => {
  //   state.isLoading = false;
  //   state.error = null;
  //   state.items[state.currentBoard].columns.push(action.payload);
  // })
  // .addCase(addColumn.pending, handlePending)
  // .addCase(addColumn.rejected, handleRejected)
  // .addCase(updateColumnTitle.fulfilled, (state, action) => {
  //   state.isLoading = false;
  //   state.error = null;
  //   const index = state.items[state.currentBoard].columns.findIndex(
  //     (column) => column._id === action.payload._id
  //   );

  //   state.items[state.currentBoard].columns[index] = action.payload;
  // })
  // .addCase(updateColumnTitle.pending, handlePending)
  // .addCase(updateColumnTitle.rejected, handleRejected)
  // .addCase(deleteColumn.pending, handlePending)
  // .addCase(deleteColumn.fulfilled, (state, action) => {
  //   state.isLoading = false;
  //   state.error = null;
  //   const index = state.items[state.currentBoard].columns.findIndex(
  //     (column) => column._id === action.payload
  //   );
  //   state.items[state.currentBoard].columns.splice(index, 1);
  // })
  // .addCase(deleteColumn.rejected, handleRejected)
  // .addCase(addTask.fulfilled, (state, action) => {
  //   state.isLoading = false;
  //   state.error = null;

  //   const index = state.items[state.currentBoard].columns.findIndex(
  //     (column) => column._id === action.payload.column
  //   );

  //   state.items[state.currentBoard].columns[index].tasks.push(
  //     action.payload
  //   );
  // })
  // .addCase(addTask.pending, handlePending)
  // .addCase(addTask.rejected, handleRejected)
  // .addCase(updateTask.fulfilled, (state, action) => {
  //   state.isLoading = false;
  //   state.error = null;

  //   const columnIndex = state.items[state.currentBoard].columns.findIndex(
  //     (column) => column._id === action.payload.column
  //   );

  //   const taskIndex = state.items[state.currentBoard].columns[
  //     columnIndex
  //   ].tasks.findIndex((task) => task._id === action.payload._id);

  //   state.items[state.currentBoard].columns[columnIndex].tasks[taskIndex] =
  //     action.payload;
  // })
  // .addCase(updateTask.pending, handlePending)
  // .addCase(updateTask.rejected, handleRejected)
  // .addCase(updateTaskPlace.fulfilled, (state, action) => {
  //   state.isLoading = false;
  //   state.error = null;
  //   const { task, oldColumn } = action.payload;

  //   const newColumnIndex = state.items[
  //     state.currentBoard
  //   ].columns.findIndex((column) => column._id === task.column);

  //   state.items[state.currentBoard].columns[newColumnIndex].tasks.push(
  //     task
  //   );

  //   const oldColumnIndex = state.items[
  //     state.currentBoard
  //   ].columns.findIndex((column) => column._id === oldColumn);

  //   const oldTaskIndex = state.items[state.currentBoard].columns[
  //     oldColumnIndex
  //   ].tasks.findIndex((item) => item._id === task._id);

  //   state.items[state.currentBoard].columns[oldColumnIndex].tasks.splice(
  //     oldTaskIndex,
  //     1
  //   );
  // })
  // .addCase(updateTaskPlace.pending, handlePending)
  // .addCase(updateTaskPlace.rejected, handleRejected)
  // .addCase(deleteTask.pending, handlePending)
  // .addCase(deleteTask.fulfilled, (state, action) => {
  //   state.isLoading = false;
  //   state.error = null;

  //   const columnIndex = state.items[state.currentBoard].columns.findIndex(
  //     (column) => column._id === action.payload.column
  //   );

  //   const taskIndex = state.items[state.currentBoard].columns[
  //     columnIndex
  //   ].tasks.findIndex((task) => task._id === action.payload._id);

  //   state.items[state.currentBoard].columns[columnIndex].tasks.splice(
  //     taskIndex,
  //     1
  //   );
  // })
  // .addCase(deleteTask.rejected, handleRejected),
});

export const { selectBoard, setFilter, dragAndDropTask, dragAndDropColumn } =
  boardsSlice.actions;
export const boardsReducer = boardsSlice.reducer;

const filterSlice = createSlice({
  name: 'filter',
  initialState: { filter: '' },
  reducers: {
    addFilter(state, { payload }) {
      state.filter = payload;
    },
  },
});

export const filterReducer = filterSlice.reducer;

export const { addFilter } = filterSlice.actions;
