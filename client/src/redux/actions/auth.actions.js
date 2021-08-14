import { setLogin } from '../../utils/authentication'
import config from '../../utils/config';

export const logIn = (credentials) => {
  return async (dispatch, getState) => {
    const { email, password } = credentials;

    const url = `${config.apiEndpoint}/auth/login`;

    let res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin'
    });

    if (res.ok) {
      let data = await res.json();
      console.log(data);
      setLogin(data.accessToken);
      return dispatch({ type: 'LOGIN_SUCCESS', payload: data });
    }

    else {
      let err = await res.json();
      console.log(res);
      return dispatch({ type: 'LOGIN_ERROR', payload: err });
    }
  }
}

export const register = (credentials) => {
  return async (dispatch, getState) => {
    dispatch({ type: 'REGISTER_ERROR', payload: null })
    const { email, password } = credentials;
    const url = `${config.apiEndpoint}/auth/register`;

    let res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin'
    });

    if (res.ok) {
      let data = await res.json();
      console.log(data);
      setLogin(data.accessToken);
      return dispatch({ type: 'REGISTER_SUCCESS', payload: data });
    }
    
    else {
      let err = await res.json();
      console.log(res);
      return dispatch({ type: 'REGISTER_ERROR', payload: err });
    }
  }
}

export const confirmEmail = async (tokenString) => {
  console.log(tokenString.toString());
  const url = `${config.apiEndpoint}/auth/verify-email`;

  let res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({ token: tokenString.toString() }),
    headers: { 'Content-Type': 'application/json' }
  });

  if (res.ok) {
    let data = await res.json();
    return (data);
  }
  else {
    let err = await res.json();
    throw Error(err.error.message)
  }

}

export const resetPassword = (email) => {
  return async (dispatch, getState) => {
    const url = `${config.apiEndpoint}/auth/forgot-password`;
    console.log(email)

    let res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(email),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin'
    });

    if (res.ok) {
      let data = await res.json();
      console.log(data);
      return dispatch({ type: 'RESET_PASSWORD', payload: data });
    }

    else {
      let err = await res.json();
      console.log(res);
      return dispatch({ type: 'RESET_PASSWORD_ERROR', payload: err });
    }
  }
}

export const newPassword = (password) => {
  return async (dispatch, getState) => {
    const url = `${config.apiEndpoint}/auth/reset-password`;
    dispatch({ type: 'NEW_PASSWORD', payload: null });
    dispatch({ type: 'NEW_PASSWORD_ERROR', payload: null });

    let res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(password),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin'
    });

    if (res.ok) {
      let data = await res.json();
      console.log(data);
      return dispatch({ type: 'NEW_PASSWORD', payload: data });
    }

    else {
      let err = await res.json();
      console.log(res);
      return dispatch({ type: 'NEW_PASSWORD_ERROR', payload: err });
    }
  }
}