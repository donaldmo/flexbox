const initState = {
  accessToken: null,
  authError: null,
  authenticated: false,
  registerSuccess: false,
  registerError: null,

  resetPasswordError: null,
  resetPasswordSuccess: null,

  newPasswordError: null,
  newPasswordSuccess: null,
};

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case 'LOGIN_ERROR':
      console.log('login error');
      return {
        ...state,
        authenticated: false,
        authError: action.payload
      }

    case 'LOGIN_SUCCESS':

      return {
        ...state,
        accessToken: action.payload,
        authenticated: true,
        authError: null
      }

    case 'REGISTER_SUCCESS':
      console.log('login error');
      return {
        ...state,
        accessToken: action.payload,
        registerSuccess: true,
        registerError: null
      }

    case 'REGISTER_ERROR':

      return {
        ...state,
        authenticated: false,
        registerError: action.payload
      }

    case 'RESET_PASSWORD':
      return {
        ...state,
        resetPasswordSuccess: action.payload,
        registerError: null
      }

    case 'RESET_PASSWORD_ERROR':
      return {
        ...state,
        newPasswordError: action.payload
      }

    case 'NEW_PASSWORD':
      return {
        ...state,
        newPasswordSuccess: action.payload,
        registerError: null
      }

    case 'NEW_PASSWORD_ERROR':
      return {
        ...state,
        newPasswordError: action.payload
      }

    default:
      return state;
  }
}

export default authReducer;