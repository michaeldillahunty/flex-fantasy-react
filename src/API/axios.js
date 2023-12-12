import axios from "axios";

// Create an instance of axios with custom configuration
const instance =  axios.create({
  baseURL: 'http://18.217.120.233', // Replace with your API's base URL
 
  timeout: 10000, // Set a timeout for requests (in milliseconds)
  
  credientials: true,
  headers: {
    
    'Content-Type': 'application/json',
    // You can include any default headers you need
  },
});
export default instance;
