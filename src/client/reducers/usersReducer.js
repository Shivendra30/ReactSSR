import { FETCH_USERS } from "../actions/index";

const initialState = [];

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USERS:
      return action.payload.data;
    default:
      return state;
  }
};
