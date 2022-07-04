import axios from "axios";
import { getToken } from "./auth";
import URL from  './URL';

const ApiSage = axios.create({
  baseURL: URL
});

ApiSage.interceptors.request.use(async config => {
  const token = getToken();
  if (token) 
    config.headers.Authorization = `Bearer ${token}`;
  
  console.log('config.headers.Authorization', config.headers.Authorization)
  return config;
});

export default ApiSage;