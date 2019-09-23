import axios from 'axios';

const api = axios.create({
  //baseURL: 'https://stf-pocka-backend.herokuapp.com', //Api Wagner
  baseURL: 'https://pocka-api.herokuapp.com', //Api Stefanini Dev
  // baseURL: 'http://localhost:3333', //Api Localhost
});

export default api;
