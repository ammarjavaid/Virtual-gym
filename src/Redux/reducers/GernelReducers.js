import {ACTIONS} from '../action-types';

const initialState = {
  loader: false,
};

const GernelReducers = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADER:
      return {
        ...state,
        loader: action.data,
      };

    default:
      return state;
  }
};

export default GernelReducers;
