import axios from 'axios';
import {store} from '../redux/store'  
import {logout} from '../redux/authSlice'
import { toast } from 'react-toastify';


const BaseUrl=import.meta.env.VITE_API_URL;
console.log("base url=",BaseUrl)
const axiosInstance = axios.create({
   baseURL: BaseUrl, // ✅ Base URL for all requests
  // baseURL: 'http://localhost:4001/api', // ✅ Base URL for all requests
  headers: {
    'Content-Type': 'application/json', // ✅ Default content type
  },
  withCredentials: true // ✅ For cookies, tokens, etc.
});

axiosInstance.interceptors.response.use(
  (response)=>response,
   (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized
      console.log("Token expired or unauthorized");
      const url = error.config.url;
       // Skip redirect for auth check request
      if (url.includes("/auth/authcheck")) {
        return Promise.reject(error);
      }
      // window.location.href='/'
      toast.warn("Your session has expired. Please login again.");
      store.dispatch(logout());  

       console.log("url=",url)


    
    }
    return Promise.reject(error);
  }
)


export default axiosInstance;