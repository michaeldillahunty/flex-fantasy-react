import axios from "axios";

// Create an instance of axios with custom configuration
const instance =  axios.create({
  baseURL: 'https://backend-mn36itr6dq-uc.a.run.app', // Replace with your API's base URL
 
  timeout: 10000, // Set a timeout for requests (in milliseconds)
  
  credientials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Content-Type': 'Authorization'
    // You can include any default headers you need
  },
});
export default instance;
