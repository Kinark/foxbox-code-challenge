import {createSlice} from '@reduxjs/toolkit';

import axios from '../../instances/axios';

import {DrinkType} from '../../types';

export interface AxiosData {
  data: {
    drinks: Array<DrinkType>;
  };
}

export interface Drinks {
  loading: boolean;
  error: string | null;
  drinks: Array<DrinkType>;
}

export const cocktailsInitialState: Drinks = {
  loading: false,
  error: null,
  drinks: [],
};

const cocktailsSlice = createSlice({
  name: 'cocktails',
  initialState: cocktailsInitialState,
  reducers: {
    loading: (state: Drinks) => {
      state.loading = true;
    },
    success: (state: Drinks, action) => {
      state.drinks = action.payload || [];
      state.loading = false;
    },
    error: (state: Drinks) => {
      state.drinks = [];
      state.loading = false;
      state.error = 'Something went wrong.';
    },
    unsetError: (state: Drinks) => {
      state.error = null;
    },
    clearDrinks: (state: Drinks) => {
      state.drinks = [];
    },
  },
});

export default cocktailsSlice.reducer;

export const {unsetError, clearDrinks} = cocktailsSlice.actions;

const {loading, success, error} = cocktailsSlice.actions;

export function getCocktails(query: string) {
  return async (dispatch) => {
    dispatch(loading());
    try {
      const {data}: AxiosData = await axios.get(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`,
      );
      dispatch(success(data.drinks));
    } catch (err) {
      dispatch(error());
    }
  };
}
