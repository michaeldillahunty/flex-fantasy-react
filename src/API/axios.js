import axios from "axios";

// Create an instance of axios with custom configuration
const instance =  axios.create({
  baseURL: 'ec2-18-217-120-233.us-east-2.compute.amazonaws.com', // Replace with your API's base URL
 
  timeout: 10000, // Set a timeout for requests (in milliseconds)
  
  credientials: true,
  headers: {
    
    'Content-Type': 'application/json',
    // You can include any default headers you need
  },
});
export default instance;
