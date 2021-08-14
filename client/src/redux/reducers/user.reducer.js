const initState = {
  userData: null,
  userError: null,
};

const userReducer = (state = initState, action) => {
  switch (action.type) {
    case 'USER_DATA':
      return {
        ...state,
        userData: action.payload
      }

    default:
      return state;
  }
}

export default userReducer;