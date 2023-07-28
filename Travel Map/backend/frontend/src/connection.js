import axios from "axios";

export const axiosInstance = axios.create({
  baseURL : "https://react-travel-map.herokuapp.com/api/"
})