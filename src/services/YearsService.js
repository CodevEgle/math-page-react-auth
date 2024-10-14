import axios from 'axios';
import authHeader from './authHeader';  // Import the authHeader function

const API_URL = 'http://localhost:8080/api/years';

class YearsService {
  getYears() {
    return axios.get(API_URL, { headers: authHeader() });  // Include the Authorization header
  }
}

export default new YearsService();
