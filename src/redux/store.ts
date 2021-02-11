import {configureStore} from '@reduxjs/toolkit';
import * as reducers from './ducks/index';

const store = configureStore({
  reducer: reducers,
});

console.log(store);

export default store;
