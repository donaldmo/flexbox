import { setLogout } from '../../utils/authentication';
import config from '../../utils/config';
const accessToken = localStorage.getItem('pandopot_user_token');

// shop
export const getUsers = () => {
  return async (dispatch, getState) => {
    const url = `${config.apiEndpoint}/auth/users`;

    let res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (res.ok) {
      let data = await res.json();
      return dispatch({ type: 'GET_USERS', payload: data });
    }
    else {
      let err = await res.json();
      console.log(err);
      return dispatch({ type: 'GET_USERS_ERROR', payload: err });
    }
  }
}

export const getSingleUser = (id) => {
  return async (dispatch, getState) => {
    const url = `${config.apiEndpoint}/auth/single-user/${id}`;

    let res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (res.ok) {
      let data = await res.json();
      return dispatch({ type: 'GET_SINGLE_USER', payload: data });
    }

    else {
      let err = await res.json();
      console.log(err);
      return dispatch({ type: 'GET_SINGLE_USER_ERROR', payload: err });
    }
  }
}
