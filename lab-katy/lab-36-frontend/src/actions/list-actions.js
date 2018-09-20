'use strict';

import superagent from 'superagent';

export const listSet = lists => ({
  type: 'LIST_SET', 
  payload: lists,
})

export const listCreate = list => ({
  type: 'LIST_CREATE', 
  payload: list,
})

export const listUpdate = list => ({
  type: 'LIST_UPDATE', 
  payload: list,
})

export const listDestroy = list => ({
  type: 'LIST_DESTROY',
  payload: list,
})

export const listFetchRequest = () => (dispatch) => {
  return superagent.get(`${__API_URL__}/api/list`)
  .then( res => {
    dispatch(listSet(res.body));
    return res;
  })
}

export const listCreateRequest = list => dispatch => {
  return superagent.post(`${__API_URL__}/api/list`)
  .send(list)
  .then( res => {
    dispatch(listCreate(res.body));
    return res;
  })
}

export const listUpdateRequest = list => dispatch => {
  return superagent.put(`${__API_URL__}/api/list/${list._id}`)
  .then( res => {
    dispatch(listUpdate(list));
    return res;
  })
}

export const listDestroyRequest = list => dispatch => {
  return superagent.delete(`${__API_URL__}/api/list/${list._id}`)
  .then( res => {
    dispatch(listDestroy(list));
    return res;
  })
}