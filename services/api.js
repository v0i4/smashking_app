import axios from "axios";

const api = axios.create({
  // baseURL: "http://192.168.0.10:3000",
  baseURL: "http://smashking-backend.herokuapp.com",
});

export default api;
