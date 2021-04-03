export const asyncSignup = (user) => 
  $.ajax({
    method: 'GET',
    url: '/api/users',
    data: {user}
  });

export const asyncReceiveUser = (userId) => 
  $.ajax({
    method: 'GET',
    url: `/api/users/${userId}`
  });

export const asyncDeleteUser = (userId) => 
  $.ajax({
    method: 'DELETE',
    url: `/api/users/${userId}`,
  });

export const asyncFetchAccount = (user) => 
  $.ajax({
    method: 'GET',
    url: '/api/users/search',
    data: {user}
  });

export const asyncLogin = (user) => 
  $.ajax({
    method: 'GET',
    url: '/api/session',
    data: {user}
  });

export const asyncLogout = () => 
  $.ajax({
    method: 'DELETE',
    url: '/api/session',
  });