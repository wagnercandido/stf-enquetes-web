import axios from 'axios';

const api = axios.create({
  baseURL: 'https://stf-pocka-backend.herokuapp.com',
});

export default api;
